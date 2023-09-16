import { DialogClose } from "@radix-ui/react-dialog";
import { Form, useNavigation } from "@remix-run/react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import RecordForm, { recordSchema } from "~/components/record-form";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useEffect, useState } from "react";
import type { z } from "zod";
import UnsavedChangesDialog from "./unsaved-changes-dialog";

const resolver = zodResolver(recordSchema);
type Record = z.infer<typeof recordSchema>;
type RecordInput = z.input<typeof recordSchema>;
type BirthDate = z.input<typeof recordSchema.shape.birthDate>;

type RecordDialogProps = {
  defaultValues?: Omit<Record, "birthDate"> & { birthDate: BirthDate } & {
    id: string;
  };
};

const RecordDialog = ({ defaultValues }: RecordDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === "submitting";
  const isFormSubmitted = navigation.state === "loading";
  const isEditMode = Boolean(defaultValues);
  const actionText = isEditMode ? "Update Record" : "Add Record";

  const formMethods = useRemixForm<RecordInput>({
    mode: "onSubmit",
    resolver,
    shouldUseNativeValidation: false,
    submitConfig: {
      action: isEditMode ? `/records/${defaultValues?.id}` : "/records/new",
      method: "post",
      replace: true,
    },
    defaultValues: defaultValues ?? {
      gender: "male",
    },
  });

  const {
    reset,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (showDialog && defaultValues) {
      reset(defaultValues);
    }

    return () => setShowAlertDialog(false);
  }, [defaultValues, showDialog, reset]);

  useEffect(() => {
    if (isFormSubmitted) {
      setShowDialog(false);
      reset();
    }
  }, [isFormSubmitted, reset]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setShowDialog(true);
      return;
    }

    if (isDirty) {
      setShowAlertDialog(true);
      return;
    }

    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="gap-4">
            {isEditMode ? <Pencil size={20} /> : <Plus size={20} />}
            <span className="hidden sm:inline">{actionText}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <Form onSubmit={formMethods.handleSubmit}>
            <DialogHeader>
              <DialogTitle>{actionText}</DialogTitle>
              <DialogDescription>
                Fill in the details below to{" "}
                {isEditMode ? "update a record" : "add a new record"}
              </DialogDescription>
            </DialogHeader>

            <RecordForm formMethods={formMethods} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={isFormSubmitting} type="submit">
                {isFormSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {actionText}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        open={showAlertDialog}
        onCancel={() => setShowAlertDialog(false)}
        onConfirm={() => setShowDialog(false)}
      />
    </>
  );
};

export default RecordDialog;
