import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PersonProvider, usePersons } from "../contexts/PersonContext";
import { PersonForm } from "../components/PersonForm";
import { Layout } from "../components/Layout";
import type { Person } from "../types/person";

function UserDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPersonById, updatePerson, addPerson, isCPFUnique } = usePersons();
  const [person, setPerson] = useState<Person | undefined>(() => {
    if (id && id !== "new") {
      return getPersonById(id);
    }
    return undefined;
  });

  const isNewUser = id === "new";

  const handleSubmit = (personData: Person) => {
    if (isNewUser) {
      // Verifica unicidade do CPF para novo pessoa
      if (!isCPFUnique(personData.cpf)) {
        alert("CPF já cadastrado!");
        return;
      }
      addPerson(personData);
    } else {
      // Verifica unicidade do CPF (excluindo o pessoa atual)
      if (!isCPFUnique(personData.cpf, person?.id)) {
        alert("CPF já cadastrado!");
        return;
      }

      if (person?.id) {
        updatePerson(person.id, personData);
      }
    }
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Se não encontrou o pessoa e não é um novo pessoa
  if (id && id !== "new" && !person) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">pessoa não encontrado</h2>
          <p className="text-gray-600 mb-6">O pessoa que você está procurando não existe.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Voltar para a lista
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNewUser ? "Novo pessoa" : "Editar pessoa"}
            </h2>
            <p className="text-gray-600">
              {isNewUser ? "Cadastre um novo pessoa no sistema" : "Atualize as informações do pessoa"}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Voltar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <PersonForm
            person={person}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </Layout>
  );
}

export function meta() {
  return [
    { title: "Detalhes do pessoa" },
    { name: "description", content: "Detalhes e edição de pessoa" },
  ];
}

export default function UserDetail() {
  return (
    <PersonProvider>
      <UserDetailContent />
    </PersonProvider>
  );
} 