"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // ✅ para observações
import { Input } from "@/components/ui/input";

// Schema alinhado com CreateAssignmentDto
const assignmentSchema = z.object({
  employeeId: z.string().uuid("Selecione um funcionário"),
  assetId: z.string().uuid("Selecione um ativo"),
  dataDeSaida: z.string().min(1, "Data de saída é obrigatória"), // ✅ novo
  dataRetornoPrevista: z.string().min(1, "Data de retorno é obrigatória"), // ✅ novo
  dataRetornoReal: z.string().optional(), // ✅ opcional
  observacoes: z.string().max(500, "Máximo de 500 caracteres").optional(), // ✅ novo
});

export default function NewAssignmentPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<{ id: string; nome: string }[]>([]);
  const [assets, setAssets] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    // Busca funcionários ativos
    api.get("/employees").then((res) => setEmployees(res.data));
    // Busca apenas ativos disponíveis
    api.get("/assets?status=disponivel").then((res) => setAssets(res.data));
  }, []);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      employeeId: "",
      assetId: "",
      dataDeSaida: "",
      dataRetornoPrevista: "",
      dataRetornoReal: "",
      observacoes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    try {
      // Converte strings de data para ISO para bater com @IsDate() do backend
      const payload = {
        ...values,
        dataDeSaida: new Date(values.dataDeSaida).toISOString(),
        dataRetornoPrevista: new Date(values.dataRetornoPrevista).toISOString(),
        dataRetornoReal: values.dataRetornoReal
          ? new Date(values.dataRetornoReal).toISOString()
          : undefined,
      };

      await api.post("/assignments", payload);
      router.push("/assignments");
      router.refresh();
    } catch (err: any) {
      console.error("Erro no Assignment:", err.response?.data);
      const msg = err.response?.data?.message;
      alert(`Erro: ${Array.isArray(msg) ? msg.join(", ") : msg}`);
    }
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Vincular Equipamento (Assignment)</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Funcionário */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionário Responsável</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o colaborador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ativo */}
              <FormField
                control={form.control}
                name="assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamento Disponível</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ativo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assets.length > 0 ? (
                          assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.nome}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            Nenhum ativo disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Saída */}
              <FormField
                control={form.control}
                name="dataDeSaida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Saída</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Retorno Prevista */}
              <FormField
                control={form.control}
                name="dataRetornoPrevista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retorno Previsto</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        min={form.getValues("dataDeSaida")} // ✅ não permite data anterior à saída
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Retorno Real (opcional) */}
              <FormField
                control={form.control}
                name="dataRetornoReal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retorno Real (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                        min={form.getValues("dataDeSaida")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ex: Equipamento entregue com acessórios completos..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Confirmar Empréstimo
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}