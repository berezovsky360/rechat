// Файл для роботи з Supabase API
import { createClient } from '@supabase/supabase-js';

// Отримання Supabase URL і ключа
const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || '';
};

const getSupabaseKey = () => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_key') || '';
};

// Функція для отримання клієнта Supabase
export const getSupabaseClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL або ключ не налаштовані');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// API для роботи з шаблонами
export const templatesAPI = {
  // Отримати всі шаблони
  getTemplates: async (category = null) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: 'Клієнт Supabase не ініціалізовано' };
    
    try {
      let query = supabase.from('templates').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        return { error: error.message };
      }
      
      return { templates: data || [] };
    } catch (e) {
      console.error('Помилка отримання шаблонів:', e);
      return { error: e.message, templates: [] };
    }
  },
  
  // Додати новий шаблон
  addTemplate: async (title, description, category, jsonData, creator) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: 'Клієнт Supabase не ініціалізовано' };
    
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([{
          title,
          description,
          category,
          json_data: jsonData,
          creator
        }])
        .select()
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      return { template: data };
    } catch (e) {
      console.error('Помилка додавання шаблону:', e);
      return { error: e.message };
    }
  }
};

// API для роботи з історією чатів
export const chatHistoryAPI = {
  // Отримати історію чатів
  getUserHistory: async (userId = null) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: 'Клієнт Supabase не ініціалізовано' };
    
    try {
      let query = supabase.from('chat_history').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) {
        return { error: error.message };
      }
      
      return { history: data || [] };
    } catch (e) {
      console.error('Помилка отримання історії:', e);
      return { error: e.message, history: [] };
    }
  },
  
  // Додати запис в історію
  addHistoryEntry: async (query, model, status, fullConversation, userId = null) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: 'Клієнт Supabase не ініціалізовано' };
    
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert([{
          user_id: userId,
          query,
          model,
          status,
          date: new Date().toISOString(),
          full_conversation: fullConversation
        }])
        .select()
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      return { entry: data };
    } catch (e) {
      console.error('Помилка додавання запису в історію:', e);
      return { error: e.message };
    }
  }
};

// Експортуємо необхідні функції
export { getSupabaseUrl, getSupabaseKey }; 