CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.event_templates (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    valid_from timestamp with time zone DEFAULT now() NOT NULL,
    type text NOT NULL,
    template text NOT NULL
);
CREATE TABLE public.event_type (
    value text NOT NULL,
    comment text
);
CREATE TABLE public.events (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    experiment_id uuid NOT NULL,
    type text NOT NULL,
    template uuid NOT NULL,
    merge_vars jsonb NOT NULL,
    user_id text
);
CREATE TABLE public.experiment_status (
    value text NOT NULL,
    comment text NOT NULL
);
CREATE TABLE public.experiments (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    project_id uuid NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'IN_PROGRESS'::text NOT NULL,
    note text DEFAULT '<h1>             Trial 1           </h1>           <em>2002-01-03</em>           <p>             Space, the final frontier.           </p>           <h2>Process</h2>           <ul data-type="todo_list">             <li data-type="todo_item" data-done="true">               Formulate, distill and focus             </li>             <li data-type="todo_item" data-done="true">               Narrow down, define the gist             </li>             <li data-type="todo_item" data-done="false">               Determine scope and pinpoint locus             </li>           </ul>           <h2>Results</h2>           <p>Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species.</p>           <hr />           <h1>             Trial 2           </h1>           <em>2002-01-07</em>'::text NOT NULL,
    is_bookmarked boolean DEFAULT false NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);
CREATE TABLE public.messages (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    text text NOT NULL,
    author_id text NOT NULL,
    experiment_id uuid NOT NULL,
    is_deleted boolean DEFAULT false
);
CREATE TABLE public.notes (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    experiment_id uuid,
    image text NOT NULL,
    transcript text,
    pdf text,
    author_id text
);
CREATE TABLE public.project_collaborator (
    project_id uuid NOT NULL,
    collaborator_id text,
    invited_by_id text NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    invite_email text,
    invite_sent boolean DEFAULT false,
    collaborator_email text,
    collaborator_name text
);
CREATE TABLE public.project_tag (
    project_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    tagged_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.projects (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    note text DEFAULT '<h2>Introduction</h2> <p>Click this box to edit your project description.</p>  <h2>Hypothesis</h2> <p>What is the purpose of this project?</p>  <h2>Key findings</h2>  <ul>     <li>Key finding 1</li>     <li>Key finding 2</li>     <li>Key finding 3</li> </ul>'::text,
    author_id text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);
CREATE TABLE public.tags (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);
CREATE TABLE public.users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    email text,
    last_seen timestamp with time zone DEFAULT now(),
    last_typed timestamp with time zone,
    id text NOT NULL
);
CREATE VIEW public.user_private AS
 SELECT users.created_at,
    users.updated_at,
    users.name,
    users.email,
    users.last_seen,
    users.last_typed,
    users.id
   FROM public.users;
CREATE VIEW public.users_online AS
 SELECT users.id,
    users.name,
    users.last_typed,
    users.last_seen
   FROM public.users
  WHERE (users.last_seen > (now() - '00:00:10'::interval));
CREATE VIEW public.users_typing AS
 SELECT users.id,
    users.name,
    users.last_typed,
    users.last_seen,
    users.email
   FROM public.users
  WHERE (users.last_typed > (now() - '00:02:02'::interval));
ALTER TABLE ONLY public.experiment_status
    ADD CONSTRAINT experiment_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_templates
    ADD CONSTRAINT log_templates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_type
    ADD CONSTRAINT log_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_id_key UNIQUE (id);
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_project_id_invite_email_key UNIQUE (project_id, invite_email);
ALTER TABLE ONLY public.project_tag
    ADD CONSTRAINT project_tag_pkey PRIMARY KEY (project_id, tag_id);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth_id_key UNIQUE (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_experiments_updated_at BEFORE UPDATE ON public.experiments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_experiments_updated_at ON public.experiments IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_messages_updated_at ON public.messages IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_projects_updated_at ON public.projects IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_tags_updated_at ON public.tags IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.experiments
    ADD CONSTRAINT experiments_status_fkey FOREIGN KEY (status) REFERENCES public.experiment_status(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT log_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.event_templates
    ADD CONSTRAINT log_templates_type_fkey FOREIGN KEY (type) REFERENCES public.event_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT log_type_fkey FOREIGN KEY (type) REFERENCES public.event_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_collaborator_id_fkey FOREIGN KEY (collaborator_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_invited_by_id_fkey FOREIGN KEY (invited_by_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.project_collaborator
    ADD CONSTRAINT project_collaborator_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.project_tag
    ADD CONSTRAINT project_tag_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.project_tag
    ADD CONSTRAINT project_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
