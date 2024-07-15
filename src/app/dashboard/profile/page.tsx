'use client';
import { Typography } from '@components/index';
import { Button } from '@components/ui/button';
import UploadImageModal from '@components/upload-image-modal';
import { useRegisterStudentStore } from '@lib/store';
import { ScrollArea } from '@src/components/ui/scroll-area';

const Page = () => {
  const { id, setId } = useRegisterStudentStore();
  const randomId: string = '9c796e2f-0f5a-42b2-ba98-287cfca979cf';
  return (
    <ScrollArea className="h-full">
      <h1 className="mb-5 flex flex-col text-center">
        {!!id ? (
          `Image will be upload to the recent Registration ID:- ${id}`
        ) : (
          <>
            <Typography className="py-2">
              Please register first to upload documents
            </Typography>
            <Button
              onClick={() => {
                setId(randomId);
              }}
            >
              Set Random
            </Button>
          </>
        )}
      </h1>
      {/* <UploadImageModal /> */}
    </ScrollArea>
  );
};
export default Page;
