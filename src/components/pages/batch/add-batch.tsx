// import { Form, FormFieldType } from '@components/form';
// import { OptionsT } from '@components/form/type';
// import { Button } from '@components/ui/button';
// import { Checkbox } from '@components/ui/checkbox';
// import { DataTable } from '@components/ui/data-table';
//
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle
// } from '@components/ui/dialog';
// import { showToast } from '@components/ui/show-toast';
// import { domainColumn } from '@constants/columns';
// import { batchFields } from '@constants/input-fields';
// import {
//   batchQueryKey,
//   domainQueryKey,
//   staffQueryKey
// } from '@constants/query-keys';
// import { FailedToastTitle } from '@constants/toast-message';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useCMutation } from '@hooks/useCMutation';
// import { useCQuery } from '@hooks/useCQuery';
// import { BatchModel, BatchModelType, DomainModelType } from '@src/models';
// import { ColumnDef } from '@tanstack/react-table';
// import React, { useEffect, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
//
// type Props = {
//   open: boolean;
//   onClose: () => void;
//   projectId: string;
// };
// interface ColType extends DomainModelType {
//   id: string;
// }
// // export const AddBatch = ({ open, onClose, projectId }: Props) => {
// //   return (
// //     <Dialog open={open} onOpenChange={onClose}>
// //       <DialogContent>
// //         <DialogHeader>
// //           <DialogTitle>
// //             {isSelectedDomain ? 'Add Batch' : 'Select Domain'}
// //           </DialogTitle>
// //           <DialogDescription>
// //             {isSelectedDomain ? 'Add Batch' : 'Select Domain to add batch'}
// //           </DialogDescription>
// //         </DialogHeader>
// //         {isSelectedDomainId.length > 0 && isSelectedDomain ? (
// //         ) : (
// //           <>
// //             <Button
// //               disabled={loading || isLoading || isSelectedDomainId.length === 0}
// //               onClick={() => setSelectedDomain(true)}
// //             >
// //               Done
// //             </Button>
// //           </>
// //         )}
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };
