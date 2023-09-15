import { DialogClose } from "@radix-ui/react-dialog";
import { Form, useNavigation } from "@remix-run/react";
import { Loader2, Plus } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import type { RecordSchema } from "~/components/record-form";
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

const resolver = zodResolver(recordSchema);

const NewRecordDialog = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === "submitting";
  const isFormSubmitted = navigation.state === "loading";

  const formMethods = useRemixForm<RecordSchema>({
    mode: "onSubmit",
    resolver,
    shouldUseNativeValidation: false,
    submitConfig: {
      action: "/records/new",
      method: "post",
    },
    defaultValues: {
      gender: "male",
    },
  });

  const { reset } = formMethods;

  useEffect(() => {
    if (isFormSubmitted) {
      setOpen(false);
      reset();
    }
  }, [isFormSubmitted, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          formMethods.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-4">
          <Plus size={20} />
          <span className="hidden sm:inline">Add Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <Form onSubmit={formMethods.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Record</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new record
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
              Add Record
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRecordDialog;
