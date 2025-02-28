"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import type { QuizResults } from "./types"

interface UserInfoFormProps {
  results: QuizResults
  onSubmit: (userInfo: UserInfo) => void
}

export interface UserInfo {
  firstName: string
  lastName: string
  email: string
  company?: string
  role?: string
}

export function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(userInfo)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">¡Felicitaciones!</h1>
      <p className="mb-6">Ha completado la evaluación. Permítanos saber cómo compartir sus resultados.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">Nombre*</Label>
          <Input
            id="firstName"
            type="text"
            required
            value={userInfo.firstName}
            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            className="bg-blue-50"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Apellido*</Label>
          <Input
            id="lastName"
            type="text"
            required
            value={userInfo.lastName}
            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            className="bg-blue-50"
          />
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico*</Label>
          <Input
            id="email"
            type="email"
            required
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="bg-blue-50"
          />
          <p className="text-sm text-gray-500 mt-1">
            Por favor ingrese su correo electrónico. Nunca compartiremos sus resultados con nadie.
          </p>
        </div>

        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            type="text"
            value={userInfo.company}
            onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
            className="bg-blue-50"
          />
        </div>

        <div>
          <Label htmlFor="role">Cargo</Label>
          <Input
            id="role"
            type="text"
            value={userInfo.role}
            onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
            className="bg-blue-50"
          />
        </div>

        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-full">
          Enviar mis resultados
        </Button>
      </form>
    </motion.div>
  )
}

