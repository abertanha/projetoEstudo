"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema atualizado conforme seu CreateEmployeeDto
const employeeSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14),
  departament: z.string().min(2, "Departamento é obrigatório"), // Corrigido para bater com o DTO
  isActive: z.boolean().default(true), // Adicionado conforme DTO
});

export default function NewEmployeePage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { 
      nome: "", 
      email: "", 
      cpf: "", 
      departament: "", 
      isActive: true 
    },
  });

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    try {
      // Limpa pontuação do CPF para bater com o @IsNumberString() do back
      const payload = {
        ...values,
        cpf: values.cpf.replace(/\D/g, ""), 
      };

      await api.post("/employees", payload);
      router.push("/employees");
      router.refresh();
    } catch (err: any) {
      console.error("Erro no NestJS:", err.response?.data);
      alert(`Erro: ${JSON.stringify(err.response?.data?.message)}`);
    }
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Novo Funcionário (Sync com DTO)</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="cpf" render={({ field }) => (
                <FormItem><FormLabel>CPF (Apenas números)</FormLabel><FormControl><Input {...field} maxLength={11} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="departament" render={({ field }) => (
                <FormItem><FormLabel>Departamento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <Button type="submit" className="w-full">Salvar Funcionário</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}