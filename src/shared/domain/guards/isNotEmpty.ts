export default function guardIsNotEmpty(field: string, fieldName: string) {
  if (field === '' || field == null) {
    throw new Error(`Field ${fieldName} could not be empty`)
  }
}
