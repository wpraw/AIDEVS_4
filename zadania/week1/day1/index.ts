import fs from "node:fs"
import path from "node:path"
import Papa from "papaparse"
import {
  braveVerify,
  chatJson,
  createOpenRouterClient,
  logger,
  type Message,
} from "../../../lib/index.js"

const TAGS = [
  "IT",
  "transport",
  "edukacja",
  "medycyna",
  "praca z ludźmi",
  "praca z pojazdami",
  "praca fizyczna",
] as const

type Tag = (typeof TAGS)[number]

type CsvRow = {
  name: string
  surname: string
  gender: string
  birthDate: string
  birthPlace: string
  birthCountry: string
  job: string
}

type PersonAnswer = {
  name: string
  surname: string
  gender: string
  born: number
  city: string
  tags: Tag[]
}

const CURRENT_YEAR = 2026

// 1. Load & parse CSV
const csvPath = path.resolve(import.meta.dirname, "people.csv")
const csvContent = fs.readFileSync(csvPath, "utf-8")
const { data: rows } = Papa.parse<CsvRow>(csvContent, {
  header: true,
  skipEmptyLines: true,
})
logger.info(`Loaded ${rows.length} rows from CSV`)

// 2. Filter: male, born in Grudziądz, aged 20–40 in 2026
const filtered = rows.filter((row) => {
  const birthYear = new Date(row.birthDate).getFullYear()
  const age = CURRENT_YEAR - birthYear
  return (
    row.gender === "M" &&
    row.birthPlace === "Grudziądz" &&
    age >= 20 &&
    age <= 40
  )
})
logger.info(`Filtered to ${filtered.length} candidates`)

// 3. Tag jobs via LLM (structured output)
const client = createOpenRouterClient()

const SYSTEM_PROMPT = `Jesteś ekspertem od klasyfikacji zawodów. Na podstawie opisu stanowiska przypisz odpowiednie tagi z poniższej listy.

Dostępne tagi:
- IT — programowanie, algorytmy, bazy danych, systemy informatyczne, tworzenie oprogramowania
- transport — ORGANIZACJA, PLANOWANIE lub ZARZĄDZANIE przemieszczaniem towarów/osób: logistyka, spedycja, planowanie tras, zarządzanie łańcuchem dostaw, koordynacja wysyłek
- edukacja — nauczanie, szkolenie, przekazywanie wiedzy, praca w szkole/na uczelni
- medycyna — zdrowie, leczenie, diagnozowanie, badania medyczne, farmacja
- praca z ludźmi — bezpośredni kontakt z ludźmi: obsługa klienta, mediacja, pomoc społeczna, bezpieczeństwo publiczne, ochrona
- praca z pojazdami — FIZYCZNA obsługa, naprawa lub prowadzenie pojazdów/maszyn: mechanik, kierowca, serwisant, operator maszyn
- praca fizyczna — wysiłek fizyczny: budowa, rzemiosło, montaż, obróbka materiałów, stolarka, hydraulika

KLUCZOWE ROZRÓŻNIENIE — "transport" vs "praca z pojazdami":
• "transport" = logistyka i zarządzanie przepływem towarów/osób (planowanie tras, optymalizacja dostaw, zarządzanie flotą, koordynacja łańcucha dostaw)
• "praca z pojazdami" = fizyczna praca Z pojazdami (naprawianie, prowadzenie, serwisowanie, obsługa techniczna)
Przykłady:
  - Mechanik naprawiający samochody → "praca z pojazdami" (NIE transport)
  - Logistyk planujący trasy dostaw → "transport"
  - Spedytor koordynujący wysyłki → "transport"
  - Osoba zarządzająca ruchem towarowym → "transport"

Jedna osoba może mieć wiele tagów. Przypisz TYLKO pasujące tagi.

Otrzymasz listę opisów stanowisk ponumerowanych od 0. Dla każdego zwróć tablicę tagów.
Odpowiedz obiektem JSON: { "results": { "0": ["tag1"], "1": ["tag2", "tag3"], ... } }`

type BatchResult = { results: Record<string, string[]> }

const tagJobsBatch = async (jobs: string[]) => {
  const jobList = jobs
    .map((job, i) => `[${i}] "${job}"`)
    .join("\n\n")

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Sklasyfikuj każdy z poniższych opisów stanowisk:\n\n${jobList}`,
    },
  ]

  const result = await chatJson<BatchResult>(client, messages)
  return result.results ?? {}
}

logger.info("Sending all jobs to LLM in a single batch...")
const batchResults = await tagJobsBatch(filtered.map((p) => p.job))

const tagged: PersonAnswer[] = filtered.map((person, i) => {
  const rawTags = batchResults[String(i)] ?? []
  const tags = rawTags.filter((t: string): t is Tag =>
    (TAGS as readonly string[]).includes(t),
  )
  const birthYear = new Date(person.birthDate).getFullYear()
  logger.info(`Tagged ${person.name} ${person.surname}: [${tags.join(", ")}]`)
  return {
    name: person.name,
    surname: person.surname,
    gender: person.gender,
    born: birthYear,
    city: person.birthPlace,
    tags,
  }
})

// 4. Keep only people with "transport" tag
const transportPeople = tagged.filter((p) => p.tags.includes("transport"))
logger.info(`Found ${transportPeople.length} transport workers`)
logger.info(JSON.stringify(transportPeople, null, 2))

// 5. Send answer
const response = await braveVerify({
  task: "people",
  answer: transportPeople,
})
console.log("Response:", response)
