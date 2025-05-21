import { format } from 'date-fns'
import Anthropic from '@anthropic-ai/sdk'

import type { NullableType } from '@/common'
import type { Task } from '@/domain/task.domain'
import type { Horse } from '@/domain/horse.domain'
import type { HorseEvent } from '@/domain/horse-event.domain'

import { env } from '@/config/env/env'
import { queryClient } from '@/presentation/core/react/query-client'

// Тип для ответа от LLM
interface ParsedScheduleResult {
  horseEvents: HorseEvent[]
  newHorses?: Horse[]
}

// Функция для создания промпта
function createPrompt(text: string, horses: Horse[], tasks: Task[], events: HorseEvent[]): string {
  const today = format(new Date(), 'MM-dd-yyyy')

  return `
  Проанализируй текст расписания коневода и преобразуй его в структурированный JSON формат. 
  
  Вот текущий список лошадей:
  ${JSON.stringify(horses, null, 2)}
  
  Вот текущий список задач:
  ${JSON.stringify(tasks, null, 2)}
  
  Вот существующие события на сегодня:
  ${JSON.stringify(events.filter(e => e.date === today), null, 2)}
  
  Вот текст расписания:
  """
  ${text}
  """
  
  Правила парсинга:
  1. Если упоминается лошадь, которой нет в списке, создай новую запись о лошади.
  2. Для каждого события определи время (в формате "HH:mm").
  3. Определи тип действия: "Собрать" (id: default-collect), "Разобрать" (id: default-disassemble) или "Выгулить" (id: default-walk).
  4. Если указано "с+р", это означает "Собрать и Разобрать" - создай два отдельных события.
  5. Если указано "11/12", это значит в 11:00 собрать, в 12:00 разобрать - создай два отдельных события.
  6. Если в тексте упоминается "помощь" или "помочь" для лошади, но не указана конкретная задача, используй задачу "Собрать".
  7. Если в тексте есть формулировка вида "11 Николь", это обычно означает "Собрать Николь в 11:00".
  8. Установи дату события на сегодня (${today}).
  9. Установи флаг completed как false для всех новых событий.
  
  Верни только JSON ответ в следующем формате:
  {
    "horseEvents": [
      {
        "id": "event-[уникальный ID, например timestamp]",
        "horseId": "[ID лошади]",
        "tasksIds": ["[ID задачи]"],
        "time": "[время в формате HH:mm]",
        "date": "${today}",
        "completed": false
      }
    ],
    "newHorses": [
      {
        "id": "horse-[уникальный ID]",
        "name": "[имя лошади]",
        "colors": ["brown"]
      }
    ]
  }
  
  Верни только JSON без дополнительного текста или пояснений.
  `
}

// Класс сервиса для парсинга расписания
export class ScheduleParserService {
  // Метод для отправки запроса к LLM (используем Anthropic API)
  private static async sendToLLM(prompt: string): Promise<NullableType<ParsedScheduleResult>> {
    try {
      // Это место для реального API-запроса
      const client = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      })

      const message = await client.messages.create({
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-5-sonnet-latest',
      })

      const resultText = message.content[0].type === 'text' ? JSON.parse(message.content[0].text) as ParsedScheduleResult : null

      return resultText
    }
    catch (error) {
      console.error('Ошибка при отправке запроса к LLM:', error)
      throw error
    }
  }

  // Основной метод для парсинга текста расписания
  public static async parseScheduleText(
    text: string,
    horses: Horse[],
    tasks: Task[],
    events: HorseEvent[],
    addHorse: (horse: Horse) => void,
    addEvent: (event: HorseEvent) => void,
  ): Promise<{
      success: boolean
      addedEvents?: number
      addedHorses?: number
      error?: any
    }> {
    try {
      // Создаем промпт
      const prompt = createPrompt(text, horses, tasks, events)

      // Отправляем запрос к LLM
      const result = await this.sendToLLM(prompt)

      if (!result) {
        return {
          success: false,
        }
      }

      // Обрабатываем результат
      const { horseEvents, newHorses } = result

      // Добавляем новых лошадей, если они есть
      if (newHorses && newHorses.length > 0) {
        for (const horse of newHorses) {
          addHorse(horse)
        }
      }

      // Добавляем новые события
      if (horseEvents && horseEvents.length > 0) {
        for (const event of horseEvents) {
          addEvent(event)
        }
      }

      // Инвалидируем запросы для обновления UI
      queryClient.invalidateQueries({ queryKey: ['horse-events'] })

      return {
        success: true,
        addedEvents: horseEvents.length,
        addedHorses: newHorses?.length || 0,
      }
    }
    catch (error) {
      console.error('Ошибка при обработке расписания:', error)
      return { success: false, error }
    }
  }
}
