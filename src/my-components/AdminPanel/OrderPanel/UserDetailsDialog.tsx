import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { type User } from "@/types/models";
  
  interface Props {
    user: User | null;
    onClose: () => void;
  }
  
  export function UserDetailsDialog({ user, onClose }: Props) {
    return (
      <Dialog open={!!user} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о пользователе</DialogTitle>
          </DialogHeader>
          {user && (
            <div className="space-y-2">
              <p><strong>ФИО:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Телефон:</strong> {user.phone}</p>
              <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
  