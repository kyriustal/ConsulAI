import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if keys are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL");

// Initialize Supabase Client if keys exist, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback Local Storage functions to ensure seamless execution in the sandbox
const LOCAL_STORAGE_USERS_KEY = "supabase_fallback_users";
const LOCAL_STORAGE_CASES_KEY = "supabase_fallback_cases";
const LOCAL_STORAGE_ACTIVITY_LOGS_KEY = "supabase_fallback_activity_logs";

const getFallbackActivityLogs = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_ACTIVITY_LOGS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveFallbackActivityLogs = (logs: any[]) => {
  localStorage.setItem(LOCAL_STORAGE_ACTIVITY_LOGS_KEY, JSON.stringify(logs));
};

const getFallbackUsers = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
  if (!data) {
    // Return empty list of initial fallback users (they are saved securely in the Supabase Database / Backend instead)
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveFallbackUsers = (users: any[]) => {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
};

const getFallbackCases = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_CASES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveFallbackCases = (cases: any[]) => {
  localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(cases));
};

// Unified database operations wrapper that seamlessly uses real Supabase or localStorage fallback
export const dbService = {
  // Users Operations
  async getUser(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", cleanEmail)
          .maybeSingle();
        if (error) {
          console.error("Erro ao buscar utilizador no Supabase:", error);
          throw error;
        }
        if (data) {
          // Normalize to application model schema
          return {
            email: data.email,
            uid: data.uid,
            password: data.password,
            role: data.role,
            createdAt: data.created_at,
            createdBy: data.created_by
          };
        }
        return null;
      } catch (err) {
        console.warn("Falha de rede Supabase, recorrendo a backup em memória local:", err);
        const fallbackUsers = getFallbackUsers();
        return fallbackUsers.find((u: any) => u.email === cleanEmail) || null;
      }
    } else {
      const fallbackUsers = getFallbackUsers();
      return fallbackUsers.find((u: any) => u.email === cleanEmail) || null;
    }
  },

  async saveUser(email: string, userData: any) {
    const cleanEmail = email.trim().toLowerCase();
    const payload = {
      email: cleanEmail,
      uid: userData.uid,
      password: userData.password,
      role: userData.role,
      created_at: userData.createdAt || new Date().toISOString(),
      created_by: userData.createdBy || "system",
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("users")
          .upsert(payload, { onConflict: "email" });
        if (error) {
          console.error("Erro ao salvar utilizador no Supabase:", error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn("Falha de rede Supabase ao salvar, salvando em memória local:", err);
        const fallbackUsers = getFallbackUsers();
        const existingIdx = fallbackUsers.findIndex((u: any) => u.email === cleanEmail);
        if (existingIdx !== -1) {
          fallbackUsers[existingIdx] = { ...fallbackUsers[existingIdx], ...userData, updatedAt: new Date().toISOString() };
        } else {
          fallbackUsers.push({ email: cleanEmail, ...userData });
        }
        saveFallbackUsers(fallbackUsers);
        return true;
      }
    } else {
      const fallbackUsers = getFallbackUsers();
      const existingIdx = fallbackUsers.findIndex((u: any) => u.email === cleanEmail);
      if (existingIdx !== -1) {
        fallbackUsers[existingIdx] = { ...fallbackUsers[existingIdx], ...userData, updatedAt: new Date().toISOString() };
      } else {
        fallbackUsers.push({ email: cleanEmail, ...userData });
      }
      saveFallbackUsers(fallbackUsers);
      return true;
    }
  },

  async deleteUser(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("email", cleanEmail);
        if (error) {
          console.error("Erro ao deletar utilizador no Supabase:", error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn("Falha de rede Supabase ao deletar, removendo em memória local:", err);
        const fallbackUsers = getFallbackUsers();
        const filtered = fallbackUsers.filter((u: any) => u.email !== cleanEmail);
        saveFallbackUsers(filtered);
        return true;
      }
    } else {
      const fallbackUsers = getFallbackUsers();
      const filtered = fallbackUsers.filter((u: any) => u.email !== cleanEmail);
      saveFallbackUsers(filtered);
      return true;
    }
  },

  async listUsers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Erro ao carregar equipa do Supabase:", error);
          throw error;
        }
        return (data || []).map((row: any) => ({
          email: row.email,
          uid: row.uid,
          password: row.password,
          role: row.role,
          createdAt: row.created_at,
          createdBy: row.created_by
        }));
      } catch (err) {
        console.warn("Falha ao carregar equipa Supabase, usando memória local:", err);
        return getFallbackUsers();
      }
    } else {
      return getFallbackUsers();
    }
  },

  // Cases / Evaluations Operations
  async listCases() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Erro ao carregar casos do Supabase:", error);
          throw error;
        }
        return (data || []).map((row: any) => ({
          id: row.id,
          createdAt: row.created_at,
          applicantName: row.applicant_name,
          country: row.country,
          decision: row.decision,
          riskScore: Number(row.risk_score),
          result: row.result
        }));
      } catch (err) {
        console.warn("Falha ao carregar casos do Supabase, usando memória local:", err);
        return getFallbackCases();
      }
    } else {
      return getFallbackCases();
    }
  },

  async saveCase(caseEntry: any) {
    const payload = {
      id: caseEntry.id,
      created_at: caseEntry.createdAt || new Date().toISOString(),
      applicant_name: caseEntry.applicantName,
      country: caseEntry.country,
      decision: caseEntry.decision,
      risk_score: caseEntry.riskScore,
      result: caseEntry.result
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("cases")
          .upsert(payload, { onConflict: "id" });
        if (error) {
          console.error("Erro ao salvar caso no Supabase:", error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn("Falha ao carregar casos no Supabase, salvando localmente:", err);
        const fallbackCases = getFallbackCases();
        const existingIdx = fallbackCases.findIndex((c: any) => c.id === caseEntry.id);
        if (existingIdx !== -1) {
          fallbackCases[existingIdx] = caseEntry;
        } else {
          fallbackCases.unshift(caseEntry);
        }
        saveFallbackCases(fallbackCases);
        return true;
      }
    } else {
      const fallbackCases = getFallbackCases();
      const existingIdx = fallbackCases.findIndex((c: any) => c.id === caseEntry.id);
      if (existingIdx !== -1) {
        fallbackCases[existingIdx] = caseEntry;
      } else {
        fallbackCases.unshift(caseEntry);
      }
      saveFallbackCases(fallbackCases);
      return true;
    }
  },

  async deleteCase(id: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("cases")
          .delete()
          .eq("id", id);
        if (error) {
          console.error("Erro ao deletar caso do Supabase:", error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn("Erro ao deletar caso do Supabase, removendo de memória local:", err);
        const fallbackCases = getFallbackCases();
        const filtered = fallbackCases.filter((c: any) => c.id !== id);
        saveFallbackCases(filtered);
        return true;
      }
    } else {
      const fallbackCases = getFallbackCases();
      const filtered = fallbackCases.filter((c: any) => c.id !== id);
      saveFallbackCases(filtered);
      return true;
    }
  },

  // Activity Logs Operations
  async listActivityLogs() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Erro ao carregar logs de atividade do Supabase:", error);
          throw error;
        }
        return (data || []).map((row: any) => ({
          id: row.id,
          createdAt: row.created_at,
          performedBy: row.performed_by,
          actionType: row.action_type,
          description: row.description
        }));
      } catch (err) {
        console.warn("Falha de rede Supabase ao listar logs de atividade, usando memória local:", err);
        return getFallbackActivityLogs();
      }
    } else {
      return getFallbackActivityLogs();
    }
  },

  async addActivityLog(performedBy: string, actionType: string, description: string) {
    const logItem = {
      id: "log_" + Math.floor(100000 + Math.random() * 900000),
      created_at: new Date().toISOString(),
      performed_by: performedBy,
      action_type: actionType,
      description: description
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("activity_logs")
          .insert(logItem);
        if (error) {
          console.error("Erro ao salvar log de atividade no Supabase:", error);
          throw error;
        }
        return true;
      } catch (err) {
        console.warn("Falha de rede Supabase ao salvar log de atividade, salvando em memória local:", err);
        const logs = getFallbackActivityLogs();
        logs.unshift({
          id: logItem.id,
          createdAt: logItem.created_at,
          performedBy: logItem.performed_by,
          actionType: logItem.action_type,
          description: logItem.description
        });
        saveFallbackActivityLogs(logs);
        return true;
      }
    } else {
      const logs = getFallbackActivityLogs();
      logs.unshift({
        id: logItem.id,
        createdAt: logItem.created_at,
        performedBy: logItem.performed_by,
        actionType: logItem.action_type,
        description: logItem.description
      });
      saveFallbackActivityLogs(logs);
      return true;
    }
  }
};
