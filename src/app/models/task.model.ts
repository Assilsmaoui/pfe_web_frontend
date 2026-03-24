export type Task = {
  _id?: string;
  title: string;
  description: string;
  priority: string;
  start_date: string;
  end_date: string;
  user_ids: string[];
  status?: string;
};
