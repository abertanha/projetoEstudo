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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  assignmentDate: string;
  returnDate: string | null;
  employee: { nome: string };
  asset: { nome: string; modelo: string };
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Carrega os empréstimos
  const loadAssignments = () => {
    api.get("/assignments").then((res) => setAssignments(res.data));
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Função para encerrar o empréstimo (Devolução)
  const handleFinish = async (id: string) => {
    try {
      await api.patch(`/assignments/finish/${id}`);
      loadAssignments(); // Recarrega a lista para mostrar o status atualizado
    } catch (err) {
      console.error("Erro ao encerrar:", err);
      alert("Não foi possível processar a devolução.");
    }
  };

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empréstimos de Ativos</h1>
        <Button asChild>
          <Link href="/assignments/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Vínculo
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Data Empréstimo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((asgn) => (
                <TableRow key={asgn.id}>
                  <TableCell className="font-medium">{asgn.employee?.nome}</TableCell>
                  <TableCell>
                    {asgn.asset?.nome} 
                    <span className="text-xs text-muted-foreground block">{asgn.asset?.modelo}</span>
                  </TableCell>
                  <TableCell>{new Date(asgn.assignmentDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={asgn.returnDate ? "secondary" : "default"}>
                      {asgn.returnDate ? "Devolvido" : "Em Uso"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!asgn.returnDate && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleFinish(asgn.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar
                      </Button>
                    )}
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