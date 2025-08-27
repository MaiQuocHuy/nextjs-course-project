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

export interface ReSubmitAppplicationRequest {
  portfolio: string;
  certificate: File;
  cv: File;
  other?: File;
}

export interface ReSubmitAppplicationResponse {
  userId: string;
  documents: {
    portfolio: string;
    certificate: string;
    cv: string;
    other?: string;
  };
}