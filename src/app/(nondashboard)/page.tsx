import React from "react";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to EduPlatform</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your gateway to world-class education. Discover courses, learn new
          skills, and advance your career.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Expert Instructors</h3>
          <p className="text-muted-foreground">
            Learn from industry professionals with years of experience.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Flexible Learning</h3>
          <p className="text-muted-foreground">
            Study at your own pace with our self-paced courses.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Certificates</h3>
          <p className="text-muted-foreground">
            Earn recognized certificates upon course completion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
