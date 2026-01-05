import { useRef } from "react";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CourseCertificateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  courseTitle: string;
  completionDate: string;
  adminSignature?: string;
}

export function CourseCertificate({
  open,
  onOpenChange,
  studentName,
  courseTitle,
  completionDate,
  adminSignature = "LearnHub Administration",
}: CourseCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `${studentName.replace(/\s+/g, "_")}_${courseTitle.replace(/\s+/g, "_")}_Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate certificate image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Course Certificate
          </DialogTitle>
        </DialogHeader>

        <div
          ref={certificateRef}
          className="relative bg-white p-8 md:p-12 border-8 border-double border-primary/30 rounded-lg"
          style={{ aspectRatio: "1.414/1" }}
        >
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary/40 rounded-br-lg" />

          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 tracking-wide">
                Certificate of Completion
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
            </div>

            <div className="space-y-4 max-w-2xl">
              <p className="text-gray-600 text-lg">This is to certify that</p>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">
                {studentName}
              </p>
              <p className="text-gray-600 text-lg">
                has successfully completed the course
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-gray-800 px-4">
                "{courseTitle}"
              </p>
              <p className="text-gray-600">
                on{" "}
                <span className="font-medium text-gray-800">
                  {new Date(completionDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>

            <div className="pt-8 mt-auto">
              <div className="w-64 border-t-2 border-gray-400 pt-3 mx-auto">
                <p className="text-lg font-script italic text-gray-700">
                  {adminSignature}
                </p>
                <p className="text-sm text-gray-500 mt-1">Authorized Signature</p>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-4">
              LearnHub • Online Learning Platform
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
