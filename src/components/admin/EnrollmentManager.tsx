import { useState } from 'react';
import { CheckCircle, XCircle, Clock, MoreVertical, Search, FileImage, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAllEnrollments, useUpdateEnrollmentPayment, EnrollmentWithDetails } from '@/hooks/useEnrollments';
import { toast } from 'sonner';

export default function EnrollmentManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlip, setSelectedSlip] = useState<{ url: string; name: string } | null>(null);
  const { data: enrollments, isLoading } = useAllEnrollments();
  const updatePayment = useUpdateEnrollmentPayment();

  const handlePaymentAction = async (
    enrollmentId: string,
    action: 'approved' | 'rejected'
  ) => {
    try {
      await updatePayment.mutateAsync({ enrollmentId, paymentStatus: action });
      toast.success(`Enrollment ${action} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update enrollment');
    }
  };

  const filteredEnrollments = enrollments?.filter((enrollment: EnrollmentWithDetails) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      enrollment.profile?.full_name?.toLowerCase().includes(searchLower) ||
      enrollment.profile?.email?.toLowerCase().includes(searchLower) ||
      enrollment.course?.title?.toLowerCase().includes(searchLower)
    );
  });

  const getPaymentStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-primary/10 text-primary border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage student enrollments and payment approvals
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search enrollments..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Student
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Course
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Price
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Payment Slip
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Payment Status
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Progress
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Enrolled
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  Loading enrollments...
                </td>
              </tr>
            ) : filteredEnrollments?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  No enrollments found
                </td>
              </tr>
            ) : (
              filteredEnrollments?.map((enrollment: EnrollmentWithDetails) => (
                <tr key={enrollment.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                          {enrollment.profile?.full_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('') ||
                            enrollment.profile?.email?.[0]?.toUpperCase() ||
                            '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {enrollment.profile?.full_name || 'No name'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.profile?.email || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{enrollment.course?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment.course?.instructor_name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    ${Number(enrollment.course?.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {(enrollment as any).payment_slip_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedSlip({
                          url: (enrollment as any).payment_slip_url,
                          name: enrollment.profile?.full_name || 'Unknown',
                        })}
                      >
                        <FileImage className="w-4 h-4" />
                        View Slip
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">No slip</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentStatusBadge((enrollment as any).payment_status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-primary"
                          onClick={() => handlePaymentAction(enrollment.id, 'approved')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handlePaymentAction(enrollment.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Slip Viewer Dialog */}
      <Dialog open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Slip - {selectedSlip?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedSlip?.url && (
              <>
                {selectedSlip.url.toLowerCase().endsWith('.pdf') ? (
                  <div className="flex flex-col items-center gap-4 p-8 bg-secondary/30 rounded-lg">
                    <FileImage className="w-16 h-16 text-muted-foreground" />
                    <p className="text-muted-foreground">PDF Document</p>
                    <Button asChild>
                      <a href={selectedSlip.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open PDF
                      </a>
                    </Button>
                  </div>
                ) : (
                  <img
                    src={selectedSlip.url}
                    alt="Payment slip"
                    className="w-full rounded-lg border border-border"
                  />
                )}
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <a href={selectedSlip.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
