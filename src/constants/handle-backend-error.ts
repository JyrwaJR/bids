interface ErrorObject {
  [key: string]: string[];
}

export const handleBackendError = (
  errors: ErrorObject
): { field: string; message: string } | null => {
  const firstFieldWithError = Object.keys(errors).find(
    (field) => errors[field]?.length > 0
  );

  if (firstFieldWithError) {
    return {
      field: firstFieldWithError,
      message: errors[firstFieldWithError][0] // Return the first error message for this field
    };
  }

  return null;
};
