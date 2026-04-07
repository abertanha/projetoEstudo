"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

// Interface alinhada com o que o backend retorna
interface Employee {
  id: string;
  nome: string;
  email: string;
  cpf: string;              // ✅ adicionado
  departament: string;      // ✅ spelling corrigido (sem "o" no final)
  isActive: boolean;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data));
  }, []);

  // Função para formatar CPF: 12345678901 → 123.456.789-01
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Funcionários</h1>
        <Button asChild>
          <Link href="/employees/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Funcionário
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.nome}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{formatCPF(emp.cpf)}</TableCell>
                  <TableCell>{emp.departament}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={emp.isActive ? "default" : "destructive"}>
                      {emp.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}