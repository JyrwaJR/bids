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
type Props = {
  form: UseFormReturn<StudentRegistrationModelWithDomainType>;
  fields: StepsFieldFormT[];
};
export const PreviewRegistrationForm = ({ form, fields }: Props) => {
  const baseUrl = 'https://bids.masstech.in/public';
  const [openViewImageModal, setOpenViewImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const {
    proofOfIdImageUrl,
    residentProofImageUrl,
    ageProofImageUrl,
    educationImageUrl,
    otherProofImageUrl,
    castProofImageUrl
  } = useUploadDocStore();

  const getImageUrl = (name: string) => {
    switch (name) {
      case 'ID Proof':
        return proofOfIdImageUrl;
      case 'Residence Proof':
        return residentProofImageUrl;
      case 'Age Proof':
        return ageProofImageUrl;
      case 'Education Qualification Proof':
        return educationImageUrl;
      case 'BPL Proof':
      // TODO: Add BPL
      case 'Proof of Disability':
      // TODO: Add proof of disability
      case 'Exceptional Proof':
        return otherProofImageUrl;
      case 'Proof of Caste':
        return castProofImageUrl;
      default:
        return '';
    }
  };
  return (
    <div className="space-y-5">
      {fields.map((field, i) => (
        <Card key={i} className="flex flex-col space-y-4 px-5 py-2">
          <Typography size={'h3'} colors={'primary'} weight={'bold'}>
            {field.name}
          </Typography>
          <div className="grid grid-cols-3 gap-4 py-4">
            {field.name === 'Upload Documents'
              ? field.fields.map((item, i) => (
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
                      {getImageUrl(item.name as string) ? (
                        <Button
                          variant={'secondary'}
                          onClick={() => {
                            setSelectedImage(getImageUrl(item.name));
                            if (selectedImage && selectedImage !== '') {
                              setOpenViewImageModal(true);
                            }
                          }}
                        >
                          View Image
                        </Button>
                      ) : (
                        <Typography>Not Uploaded</Typography>
                      )}
                    </div>
                  </div>
                ))
              : field.fields.map((item, i) => (
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
      {!openViewImageModal && (
        <Dialog
          modal={true}
          open={openViewImageModal}
          onOpenChange={() => setOpenViewImageModal(false)}
        >
          <DialogContent className="aspect-video w-full min-w-[60%]">
            <DialogHeader>
              <DialogTitle>View Images</DialogTitle>
            </DialogHeader>
            <div className="flex h-full w-full items-center justify-center">
              <Carousel className="aspect-video w-[93%]">
                <CarouselContent>
                  <CarouselItem>
                    <img
                      src={`${baseUrl}/${selectedImage}`} //${image.image}
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
      )}
    </div>
  );
};
