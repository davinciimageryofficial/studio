--
-- Tabela para Agências
--
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir uma agência de exemplo
INSERT INTO agencies (name) VALUES ('Sentry Innovations');

--
-- Tabela para Clientes
--
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    agency_id INTEGER REFERENCES agencies(id),
    name VARCHAR(255) NOT NULL,
    joined_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir clientes de exemplo
INSERT INTO clients (agency_id, name, joined_date, status) VALUES
(1, 'Innovate Inc.', '2023-01-15', 'Active'),
(1, 'Solutions Co.', '2023-03-22', 'Active'),
(1, 'Quantum Leap', '2023-05-10', 'Paused'),
(1, 'Nexus Corp', '2022-11-30', 'Archived');

--
-- Tabela para Projetos
--
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    agency_id INTEGER REFERENCES agencies(id),
    client_id INTEGER REFERENCES clients(id),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'In Progress', 'Completed', 'On Hold'
    budget DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir projetos de exemplo
INSERT INTO projects (agency_id, client_id, name, status, budget) VALUES
(1, 1, 'Website Redesign', 'Completed', 15000.00),
(1, 1, 'Mobile App Dev', 'In Progress', 25000.00),
(1, 2, 'Marketing Campaign', 'In Progress', 10000.00),
(1, 3, 'SEO Optimization', 'On Hold', 5000.00);

--
-- Tabela para Métricas Mensais (Financeiras e Operacionais)
--
CREATE TABLE monthly_metrics (
    id SERIAL PRIMARY KEY,
    agency_id INTEGER REFERENCES agencies(id),
    month DATE NOT NULL,
    revenue DECIMAL(12, 2),
    expenses DECIMAL(12, 2),
    new_leads INTEGER,
    projects_won INTEGER,
    portfolio_updates INTEGER,
    team_satisfaction_score DECIMAL(3, 1),
    client_satisfaction_score DECIMAL(3, 1),
    UNIQUE(agency_id, month)
);

-- Inserir métricas de exemplo para os últimos meses
INSERT INTO monthly_metrics (agency_id, month, revenue, expenses, new_leads, projects_won, portfolio_updates, team_satisfaction_score, client_satisfaction_score) VALUES
(1, '2024-05-01', 50000.00, 35000.00, 25, 4, 8, 4.5, 4.8),
(1, '2024-06-01', 55000.00, 37000.00, 30, 5, 12, 4.6, 4.7),
(1, '2024-07-01', 62000.00, 40000.00, 28, 6, 10, 4.7, 4.8);
