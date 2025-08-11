export interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterInstructorRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  portfolioUrl: string;
  certificateFile: File;
  cvFile: File;
  supportingFile?: File;
}