"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function AdminEvaluationsLoading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-72">
            <Input
              disabled
              placeholder="Buscar evaluaciones..."
              className="bg-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">ID</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Puntuación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-5 w-10 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-24 ml-auto bg-gray-200 animate-pulse rounded"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-8 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
