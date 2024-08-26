import { Typography } from '@components/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@components/ui/carousel';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { useUploadDocStore } from '@lib/store';
import { StudentRegistrationModelWithDomainType } from '@src/app/dashboard/registration/_lib/function';
import { StepsFieldFormT } from '@src/types';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useCQuery } from '@hooks/useCQuery';

type Props = {
  form: UseFormReturn<StudentRegistrationModelWithDomainType>;
  fields: StepsFieldFormT[];
  id: string;
};

export const PreviewRegistrationForm = ({ form, fields, id }: Props) => {
  const baseUrl = 'https://bids.masstech.in/public';
  const [openViewImageModal, setOpenViewImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const imageQuery = useCQuery({
    url: `registration/get-uploaded-document/${id}`
  });

  const images: any =
    imageQuery.data && imageQuery.isFetched && !imageQuery.isLoading
      ? imageQuery.data.data
      : [];

  // Document mapping to link field labels with the correct image keys
  const documentMapping: Record<string, string> = {
    'ID Proof': 'id_proof',
    'Residence Proof': 'residence_proof',
    'Age Proof': 'age_proof',
    'Caste Proof': 'caste_proof',
    'Proof of Disability': 'pwd_proof',
    'Education Proof': 'education_proof',
    'BPL Income Proof': 'bpl_income_proof',
    'Exceptional Approval Document': 'exception_approval_document'
  };

  return (
    <div className="space-y-5">
      {fields
        .filter((field) => field.name !== 'Preview')
        .map((field, i) => (
          <Card key={i} className="flex flex-col space-y-4 px-5 py-2">
            <Typography size={'h3'} colors={'primary'} weight={'bold'}>
              {field.name}
            </Typography>
            <div className="grid grid-cols-3 gap-4 py-4">
              {field.name === 'Upload Documents' &&
                field.fields.map((item, i) => {
                  // Get the corresponding image URL for the label
                  const imageField = documentMapping[item.label ?? ''];
                  const imageUrl = images?.[imageField];
                  console.log('Image URL', imageUrl);
                  return (
                    <div
                      className="col-span-1 flex items-center justify-start gap-4"
                      key={i}
                    >
                      <div>
                        <Typography>{item.label}</Typography>
                      </div>
                      <div>
                        <Typography className="text-muted-foreground">
                          :
                        </Typography>
                      </div>
                      <div>
                        {imageUrl ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedImage(imageUrl);
                              setOpenViewImageModal(true);
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Typography>N/A</Typography>
                        )}
                      </div>
                    </div>
                  );
                })}
              {field.name !== 'Upload Documents' &&
                field.fields.map((item, i) => (
                  <div className="col-span-1 flex gap-4" key={i}>
                    <div>
                      <Typography>{item.label}</Typography>
                    </div>
                    <div>
                      <Typography className="text-muted-foreground">
                        :
                      </Typography>
                    </div>
                    <div>
                      <Typography>
                        {(form.getValues()[
                          item.name as keyof StudentRegistrationModelWithDomainType
                        ] as string) ?? 'N/A'}
                      </Typography>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      <ImageDialog
        open={openViewImageModal}
        onClose={() => setOpenViewImageModal(false)}
        baseUrl={baseUrl}
        selectedImage={selectedImage}
      />
    </div>
  );
};
const ImageDialog = ({ open, onClose, baseUrl, selectedImage }: any) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="aspect-video w-full min-w-[60%]">
        <DialogHeader>
          <DialogTitle>View Images</DialogTitle>
        </DialogHeader>
        <div className="flex h-full w-full items-center justify-center">
          <Carousel className="aspect-video w-[93%]">
            <CarouselContent>
              <CarouselItem>
                <img
                  src={`${baseUrl}/${selectedImage}`}
                  alt="image not found"
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};
