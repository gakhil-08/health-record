export const patients = {
  "91-1234-5678-9012": {
    abha: "91-1234-5678-9012",
    phone: "9876543210",
    name: "Ravi Kumar",
    age: 58,
    allergies: [{ name: "Penicillin", severity: "High" }],
    medicines: [
      { name: "Metformin 500mg", dose: "Twice daily", by: "Dr. Rao, PHC" },
      { name: "Amlodipine 5mg", dose: "Once daily", by: "City Clinic" },
    ],
    tests: [
      { name: "HbA1c", date: "2026-09-10", result: "7.8%", place: "District Hospital" },
      { name: "Lipid Profile", date: "2026-08-22", result: "Borderline", place: "City Clinic" },
    ],
  },
  "91-2233-4455-6677": {
    abha: "91-2233-4455-6677",
    phone: "9123456780",
    name: "Sunita Devi",
    age: 67,
    allergies: [{ name: "Sulfa drugs", severity: "Moderate" }],
    medicines: [
      { name: "Amlodipine 10mg", dose: "Once daily", by: "PHC Rural" },
      { name: "Atorvastatin 20mg", dose: "Once nightly", by: "District Hospital" },
      { name: "Aspirin 75mg", dose: "Once daily", by: "PHC Rural" },
    ],
    tests: [
      { name: "Blood Pressure", date: "2026-09-20", result: "150/95", place: "PHC Rural" },
      { name: "ECG", date: "2026-07-14", result: "Normal", place: "District Hospital" },
    ],
  },
  "91-3344-5566-7788": {
    abha: "91-3344-5566-7788",
    phone: "9988776655",
    name: "Arjun Mehta",
    age: 29,
    allergies: [],
    medicines: [],
    tests: [{ name: "General Checkup", date: "2026-06-01", result: "All normal", place: "City Clinic" }],
  },
}

export const patientList = Object.values(patients)