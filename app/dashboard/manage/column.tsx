"use client"

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getUserLang, getUserTimeZone } from "@/lib/locale";
import { useCurrency } from "@/hooks/useCurrency";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionsForm from "@/components/TransactionsForm";

type Transaction = {
  $id: string,
  description: string,
  amount: number,
  createdAt: string,
  categoryId: string
}

interface ActionsColumnProps {
  transaction: Transaction;
  onDelete: (id: string) => Promise<void>;
  section: string;
}

function ActionsCell({ transaction, onDelete, section }: ActionsColumnProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(transaction.$id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Modify</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the transaction &quot;{transaction.description}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-400 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {section === 'expense' ? 'Expense' : 'Revenue'}</DialogTitle>
          </DialogHeader>
          <TransactionsForm
            section={section}
            onSubmitTransactions={() => setIsEditOpen(false)}
            initialData={transaction}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function createColumns(onDelete: (id: string) => Promise<void>, section: string): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "description",
      header: "Description"
    },
    {
      accessorKey: "amount",
      header: "Amount",

      cell: ({ getValue }) => {
        const amount = getValue() as number
        const lang = navigator.language
        const currency: string = useCurrency()
        return new Intl.NumberFormat(lang, {
          style: "currency",
          currency,
        }).format(amount);
      }
    },
    {
      accessorKey: "$createdAt",
      header: "Date",
      cell: ({ getValue }) => {
        const value = getValue() as string;

        const date = new Date(value);

        return new Intl.DateTimeFormat(getUserLang(), {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: getUserTimeZone()
        }).format(date);
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
        return <ActionsCell transaction={transaction} onDelete={onDelete} section={section} />;
      },
    }
  ];
}