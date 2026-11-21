import { useState } from 'react';
import * as Icons from 'lucide-react';
import { initialRows } from '@/data/mockData';
import type { Row } from '@/types';
import { Button } from './Button';

export interface RecordDialogProps {
  title: string;
  onClose: () => void;
  onSave: (record: Row) => void;
}

export function RecordDialog({ title, onClose, onSave }: RecordDialogProps) {
  const isCustomer = title.toLowerCase().includes('customer');
  const isJob = title.toLowerCase().includes('job') || title.toLowerCase().includes('card');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(initialRows.branches[0].name);
  const [status, setStatus] = useState(isCustomer ? 'Active' : 'Confirmed');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-600">
              Workspace form
            </div>
            <h2 className="mt-1 font-display text-xl font-bold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <Icons.X size={18} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold sm:col-span-2">
            {isCustomer ? 'Customer full name' : 'Name or description'}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-dialog-name"
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-cyan-500"
              placeholder={isCustomer ? 'e.g. Rajesh Sharma' : isJob ? 'e.g. Full periodic service' : 'Start typing...'}
            />
          </label>
          <label className="text-xs font-semibold">
            Branch
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            >
              {initialRows.branches.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            >
              {isCustomer ? (
                <>
                  <option>Active</option>
                  <option>At risk</option>
                  <option>Confirmed</option>
                </>
              ) : (
                <>
                  <option>Confirmed</option>
                  <option>In progress</option>
                  <option>Draft</option>
                  <option>Healthy</option>
                  <option>Stable</option>
                </>
              )}
            </select>
          </label>
          <label className="text-xs font-semibold sm:col-span-2">
            {isCustomer ? 'Contact email / notes' : 'Notes'}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 min-h-20 w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:border-cyan-500"
              placeholder={isCustomer ? 'e.g. rajesh.sharma@email.com · +91 98200 12345' : 'Add context for your team...'}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: `${isCustomer ? 'cus' : 'new'}-${Date.now()}`,
                name: name.trim() || (isCustomer ? 'New Customer' : 'Untitled workspace record'),
                detail: isCustomer
                  ? (notes.trim() || `${branch} · Customer profile`)
                  : `${branch} · ${notes.trim() || 'Added from workspace'}`,
                meta: isCustomer ? '1 vehicle · 1 visit' : 'Created just now',
                status: status || (isCustomer ? 'Active' : 'Confirmed'),
                secondary: isCustomer ? branch : (notes.trim() || 'New record'),
                amount: isJob ? '₹0' : undefined,
              })
            }
            testId="button-save-dialog"
          >
            <Icons.Check size={15} />
            Save to workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
