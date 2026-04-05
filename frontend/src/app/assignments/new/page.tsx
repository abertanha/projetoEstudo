"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const assignmentSchema = z.object({
  employeeId: z.string().uuid("Selecione um funcionário"),
  assetId: z.string().uuid("Selecione um ativo"),
});

export default function NewAssignmentPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<{ id: string; nome: string }[]>([]);
  const [assets, setAssets] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    // Busca funcionários ativos
    api.get("/employees").then((res) => setEmployees(res.data));
    
    // Busca apenas ativos com status 'disponivel'
    api.get("/assets?status=disponivel").then((res) => setAssets(res.data));
  }, []);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  });

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    try {
      // Envia para o @Post() do seu AssignmentsController
      await api.post("/assignments", values);
      router.push("/assignments"); // Redireciona para a listagem de empréstimos
      router.refresh();
    } catch (err: any) {
      console.error("Erro no Assignment:", err.response?.data);
      alert(`Erro: ${err.response?.data?.message || "Falha ao vincular ativo"}`);
    }
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Vincular Equipamento (Assignment)</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField control={form.control} name="employeeId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário Responsável</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="assetId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento Disponível</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o ativo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {assets.length > 0 ? assets.map(asset => (
                        <SelectItem key={asset.id} value={asset.id}>{asset.nome}</SelectItem>
                      )) : (
                        <SelectItem value="none" disabled>Nenhum ativo disponível</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full">Confirmar Empréstimo</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}