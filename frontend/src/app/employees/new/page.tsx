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
import { Switch } from "@/components/ui/switch";

// Schema alinhado com CreateEmployeeDto
const employeeSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string()
    .regex(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos") // ✅ validação exata
    .transform((val) => val.replace(/\D/g, "")), // garante só números
  departament: z.string().min(2, "Departamento é obrigatório"), // ✅ spelling do backend
  isActive: z.boolean().default(true),
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
      // Garante que o CPF vai limpo para o backend (@IsNumberString + @IsCPF)
      const payload = {
        ...values,
        cpf: values.cpf.replace(/\D/g, ""),
      };

      await api.post("/employees", payload);
      router.push("/employees");
      router.refresh();
    } catch (err: any) {
      console.error("Erro no NestJS:", err.response?.data);
      const msg = err.response?.data?.message;
      // Mostra erro amigável (pode ser string ou array)
      alert(`Erro: ${Array.isArray(msg) ? msg.join(", ") : msg}`);
    }
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Novo Funcionário</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input {...field} placeholder="Ex: João Silva" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl><Input type="email" {...field} placeholder="joao@empresa.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cpf" render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF (somente números)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="12345678901" 
                      maxLength={11}
                      onChange={(e) => {
                        // Permite digitar com máscara, mas o schema transforma para só números
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        field.onChange(onlyNumbers);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="departament" render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl><Input {...field} placeholder="Ex: TI, RH, Vendas" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Funcionário ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Definir como ativo ao cadastrar
                    </p>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )} />

              <Button type="submit" className="w-full">Salvar Funcionário</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}