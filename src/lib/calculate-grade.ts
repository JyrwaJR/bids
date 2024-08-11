export function calcGrade(percentage: number): string {
  if (percentage >= 90) {
    return 'Grade A+';
  } else if (percentage >= 80) {
    return 'Grade A';
  } else if (percentage >= 70) {
    return 'Grade B+';
  } else if (percentage >= 60) {
    return 'Grade B';
  } else if (percentage >= 50) {
    return 'Grade C+';
  } else if (percentage >= 40) {
    return 'Grade C';
  } else {
    return 'Grade D';
  }
}
