import { Card, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

type Props = {
  courseStatus: 'published' | 'draft';
  isLoading: boolean;
  handlePublishCourseToggle: (checked: boolean) => void;
};

const TogglePublishCourse = (props: Props) => {
  const { courseStatus, isLoading, handlePublishCourseToggle } = props;

  return (
    <Card className="gap-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Switch
            onCheckedChange={handlePublishCourseToggle}
            defaultChecked={courseStatus === 'published'}
            disabled={isLoading}
          />
          <div className="space-x-2">
            <span
              className={`ml-2 font-semibold px-3 py-1.5 rounded-md ${
                courseStatus === 'published'
                  ? 'text-green-600 bg-green-100'
                  : 'text-amber-600 bg-amber-100'
              }`}
            >
              {courseStatus === 'published' ? 'Published' : 'Draft'}
            </span>

            <span className="text-sm text-muted-foreground">
              {courseStatus === 'published'
                ? 'Your course will be submitted for approval by administrators before becoming visible to students.'
                : "Your course will be saved as a draft and won't be visible to students until published."}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TogglePublishCourse;
