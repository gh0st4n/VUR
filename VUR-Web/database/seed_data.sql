-- Insert sample packages
INSERT INTO packages (name, version, description, license, homepage, maintainer) VALUES
('vur-core', '1.0.0', 'Core utilities for VUR system', 'MIT', 'https://github.com/vur/core', 'vur-maintainer'),
('vur-cli', '2.1.3', 'Command line interface for VUR', 'GPL-3.0', 'https://github.com/vur/cli', 'vur-maintainer'),
('vur-builder', '0.9.5', 'Package builder for VUR', 'BSD-2-Clause', 'https://github.com/vur/builder', 'builder-team'),
('vur-utils', '1.2.0', 'Utility functions and helpers', 'MIT', 'https://github.com/vur/utils', 'vur-maintainer'),
('vur-docs', '1.0.0', 'Documentation generator', 'CC-BY-SA', 'https://github.com/vur/docs', 'docs-team'),
('python3', '3.11.5', 'Python programming language', 'PSF', 'https://python.org', 'python-maintainer'),
('git', '2.42.0', 'Distributed version control system', 'GPL-2.0', 'https://git-scm.com', 'git-maintainer'),
('nodejs', '20.8.0', 'JavaScript runtime', 'MIT', 'https://nodejs.org', 'nodejs-team'),
('docker', '24.0.6', 'Container platform', 'Apache-2.0', 'https://docker.com', 'docker-team'),
('nginx', '1.25.2', 'Web server and reverse proxy', 'BSD-2-Clause', 'https://nginx.org', 'nginx-maintainer');

-- Insert dependencies
INSERT INTO dependencies (package_id, depends_on_id) VALUES
-- vur-cli dependencies
((SELECT id FROM packages WHERE name = 'vur-cli'), (SELECT id FROM packages WHERE name = 'vur-core')),
((SELECT id FROM packages WHERE name = 'vur-cli'), (SELECT id FROM packages WHERE name = 'vur-utils')),
-- vur-builder dependencies
((SELECT id FROM packages WHERE name = 'vur-builder'), (SELECT id FROM packages WHERE name = 'vur-core')),
((SELECT id FROM packages WHERE name = 'vur-builder'), (SELECT id FROM packages WHERE name = 'git')),
-- vur-docs dependencies
((SELECT id FROM packages WHERE name = 'vur-docs'), (SELECT id FROM packages WHERE name = 'vur-utils')),
-- docker dependencies
((SELECT id FROM packages WHERE name = 'docker'), (SELECT id FROM packages WHERE name = 'git')),
-- nginx dependencies
((SELECT id FROM packages WHERE name = 'nginx'), (SELECT id FROM packages WHERE name = 'vur-utils'));
