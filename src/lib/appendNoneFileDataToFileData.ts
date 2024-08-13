export function appendNonFileDataToFormData<T extends Record<string, any>>(
  data: T,
  formData: FormData
): void {
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value && !(value instanceof File)) {
      formData.append(key, value);
    }
  });
}
