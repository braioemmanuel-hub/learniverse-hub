import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Loader2, FileImage } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<'courses'>;

const paymentFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  paymentSlip: z.instanceof(File, { message: "Please upload a payment slip" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      "File must be an image (JPEG, PNG, WebP) or PDF"
    ),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: () => void;
}

export function PaymentEnrollmentDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
}: PaymentEnrollmentDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("paymentSlip", file, { shouldValidate: true });
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const onSubmit = async (values: PaymentFormValues) => {
    if (!user) {
      toast.error("You must be logged in to enroll");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload payment slip to storage
      const fileExt = values.paymentSlip.name.split('.').pop();
      const fileName = `${user.id}/${course.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(fileName, values.paymentSlip);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error("Failed to upload payment slip");
      }

      // Get the URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('payment-slips')
        .getPublicUrl(fileName);

      // Check if enrollment already exists
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();

      if (existingEnrollment) {
        // Update existing enrollment with new payment slip
        const { error: updateError } = await supabase
          .from('enrollments')
          .update({
            payment_status: 'pending',
            payment_slip_url: urlData.publicUrl,
            payment_reference: values.fullName,
          })
          .eq('id', existingEnrollment.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error("Failed to update enrollment");
        }
      } else {
        // Create new enrollment
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert({
            user_id: user.id,
            course_id: course.id,
            status: 'active',
            progress: 0,
            payment_status: 'pending',
            payment_slip_url: urlData.publicUrl,
            payment_reference: values.fullName,
          });

        if (enrollError) {
          console.error('Enrollment error:', enrollError);
          throw new Error("Failed to submit enrollment");
        }
      }

      toast.success("Enrollment submitted! Please wait for admin approval.");
      form.reset();
      setPreviewUrl(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || "Failed to submit enrollment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll in Course</DialogTitle>
          <DialogDescription>
            Submit your payment details to enroll. An admin will verify your payment before granting access.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-secondary/50 p-4 mb-4">
          <p className="text-sm text-muted-foreground">Course</p>
          <p className="font-semibold text-foreground">{course.title}</p>
          <p className="text-lg font-bold text-primary mt-1">
            ${Number(course.price).toFixed(2)}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Name used for payment verification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentSlip"
              render={() => (
                <FormItem>
                  <FormLabel>Payment Slip</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <label
                        htmlFor="payment-slip"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Payment slip preview"
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, WebP or PDF (max 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="payment-slip"
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      {form.watch("paymentSlip") && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileImage className="w-4 h-4" />
                          <span className="truncate">{form.watch("paymentSlip")?.name}</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Enrollment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
