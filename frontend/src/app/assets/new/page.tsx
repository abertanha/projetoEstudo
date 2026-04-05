"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  modelo: z.string().min(2, "Modelo é obrigatório"),
  marca: z.string().min(2, "Marca é obrigatória"),
  numeroDeSerie: z.string().min(3, "Série é obrigatória"),
  dataAquisicao: z.string().min(1, "Data é obrigatória"),
  status: z.enum(["disponivel", "em_uso", "manutencao", "discarded"]),
});

export default function NewAssetPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "disponivel" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
    const payload = {
      ...values,
      dataAquisicao: new Date(values.dataAquisicao).toISOString(), 
    };

    await api.post("/assets", payload);
    router.push("/");
    router.refresh();
  } catch (error: any) {
    console.error("Erro detalhes:", error.response?.data);
    alert(`Erro: ${error.response?.data?.message || "Verifique o console"}`);
  }
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Novo Equipamento</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="marca" render={({ field }) => (
                  <FormItem><FormLabel>Marca</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="modelo" render={({ field }) => (
                  <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="numeroDeSerie" render={({ field }) => (
                <FormItem><FormLabel>Série</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="dataAquisicao" render={({ field }) => (
                  <FormItem><FormLabel>Data Compra</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full">Cadastrar no Sistema</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}