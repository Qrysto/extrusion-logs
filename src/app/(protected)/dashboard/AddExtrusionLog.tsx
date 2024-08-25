import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ExtrusionLogForm from './ExtrusionLogForm';

export default function AddExtrusionLog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2" />
          Add extrusion log
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[90%] max-w-3xl px-0">
        <DialogHeader className="flex-shrink-0 px-6">
          <DialogTitle>New Extrusion Log</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto px-6">
          <ExtrusionLogForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
