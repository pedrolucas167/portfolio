import { $ } from '@/utils/helpers';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  features: string[];
  github: string;
  demo?: string;
  category: 'fullstack' | 'backend' | 'frontend' | 'tool';
}

export class ProjectModal {
  private modal: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor() {
    this.createModal();
    this.setupEventListeners();
  }

  private createModal(): void {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'modal-overlay';
    this.overlay.className = `
      fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
      opacity-0 invisible transition-all duration-300
    `;

    // Create modal container
    this.modal = document.createElement('div');
    this.modal.id = 'project-modal';
    this.modal.className = `
      fixed inset-4 sm:inset-8 lg:inset-16 z-50 
      bg-white dark:bg-dark-card rounded-2xl shadow-2xl
      opacity-0 invisible scale-95 transition-all duration-300
      overflow-hidden flex flex-col
    `;
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'modal-title');

    // Modal content structure
    this.modal.innerHTML = `
      <div class="modal-content flex flex-col h-full overflow-hidden">
        <!-- Header -->
        <div class="modal-header flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-dark-border">
          <div class="flex items-center gap-3">
            <span id="modal-category" class="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"></span>
            <h2 id="modal-title" class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"></h2>
          </div>
          <button 
            id="modal-close" 
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
            aria-label="Fechar modal"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body flex-1 overflow-y-auto p-4 sm:p-6">
          <div class="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <!-- Left Column - Image & Links -->
            <div class="space-y-6">
              <!-- Project Image -->
              <div class="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-cyan-500">
                <div id="modal-image-container" class="absolute inset-0 flex items-center justify-center">
                  <i id="modal-icon" class="text-6xl text-white/80"></i>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <a 
                  id="modal-github" 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <i class="fab fa-github"></i>
                  Ver Código
                </a>
                <a 
                  id="modal-demo" 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  <i class="fas fa-external-link-alt"></i>
                  Demo ao Vivo
                </a>
              </div>

              <!-- Technologies -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Tecnologias
                </h3>
                <div id="modal-technologies" class="flex flex-wrap gap-2"></div>
              </div>
            </div>

            <!-- Right Column - Details -->
            <div class="space-y-6">
              <!-- Description -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Sobre o Projeto
                </h3>
                <p id="modal-description" class="text-gray-600 dark:text-gray-300 leading-relaxed"></p>
              </div>

              <!-- Features -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Principais Funcionalidades
                </h3>
                <ul id="modal-features" class="space-y-2"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.modal);
  }

  private setupEventListeners(): void {
    // Close button
    const closeBtn = $('#modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    // Overlay click
    this.overlay?.addEventListener('click', () => this.close());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Project card clicks
    document.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('[data-project]');
      if (card) {
        const projectId = card.getAttribute('data-project');
        if (projectId) {
          this.openProject(projectId);
        }
      }
    });
  }

  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      fullstack: 'Full-Stack',
      backend: 'Backend',
      frontend: 'Frontend',
      tool: 'Ferramenta',
    };
    return labels[category] || category;
  }

  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      fullstack: 'fas fa-layer-group',
      backend: 'fas fa-server',
      frontend: 'fas fa-palette',
      tool: 'fas fa-tools',
    };
    return icons[category] || 'fas fa-code';
  }

  public openProject(projectId: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    this.populateModal(project);
    this.open();
  }

  private getProjectById(id: string): Project | undefined {
    const projects: Project[] = [
      {
        id: 'messagelove',
        title: 'MessageLove',
        description: 'Plataforma para criar e compartilhar mensagens personalizadas para momentos especiais.',
        longDescription: `MessageLove é uma plataforma completa para criar e compartilhar mensagens personalizadas e memoráveis. 
        
O sistema permite que usuários criem cartões digitais com fotos, músicas e mensagens especiais, perfeitos para celebrar relacionamentos e momentos importantes.

A aplicação conta com autenticação segura, dashboard pessoal, upload de imagens para AWS S3, integração com músicas e suporte a 5 idiomas diferentes.`,
        image: '',
        technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'AWS S3', 'JWT'],
        features: [
          'Autenticação segura com JWT e bcrypt',
          'Dashboard pessoal para gerenciar memórias',
          'Cartões 100% personalizáveis com fotos e músicas',
          'Upload de imagens otimizadas com Sharp para AWS S3',
          'Contador de tempo real do relacionamento',
          'Suporte a 5 idiomas (PT, EN, ES, HI, AR)',
          'Links únicos e compartilháveis',
          'Design responsivo e moderno',
        ],
        github: 'https://github.com/pedrolucas167/messagelove',
        demo: 'https://messagelove.com.br',
        category: 'fullstack',
      },
      {
        id: 'site-status-checker',
        title: 'Site Status Checker',
        description: 'Script Python para verificar o status HTTP e latência de múltiplos sites.',
        longDescription: `Site Status Checker é uma ferramenta de linha de comando desenvolvida em Python para monitoramento de sites.
        
O script verifica se um ou mais sites estão online, mede o tempo de resposta (latência) e gera alertas quando a latência ultrapassa limites aceitáveis.

Perfeito para administradores de sistemas e desenvolvedores que precisam monitorar a disponibilidade de seus serviços.`,
        image: '',
        technologies: ['Python 3', 'Requests', 'Colorama', 'CLI'],
        features: [
          'Verificação de status HTTP (código 200)',
          'Medição de tempo de resposta em milissegundos',
          'Alertas para latência alta (> 500ms)',
          'Suporte a múltiplas URLs via argumentos',
          'Leitura de URLs de arquivos .txt',
          'Geração automática de relatórios',
          'Interface colorida no terminal',
          'Código leve e eficiente',
        ],
        github: 'https://github.com/pedrolucas167/site_status_checker',
        category: 'tool',
      },
      {
        id: 'sistema-estoque',
        title: 'Sistema de Estoque',
        description: 'Sistema completo para gerenciamento de estoque com React e Spring Boot.',
        longDescription: `Sistema de Estoque é uma aplicação full-stack para controle e gerenciamento de produtos em estoque.
        
O frontend em React oferece uma interface moderna e intuitiva, enquanto o backend em Spring Boot fornece uma API RESTful robusta e escalável.

O sistema permite cadastrar produtos, atualizar quantidades, gerenciar categorias e acompanhar todas as operações de entrada e saída.`,
        image: '',
        technologies: ['Java', 'Spring Boot', 'React', 'Vite', 'JavaScript', 'REST API'],
        features: [
          'Cadastro completo de produtos',
          'Controle de categorias',
          'Atualização de quantidades em tempo real',
          'Remoção segura de itens',
          'API RESTful com Spring Boot',
          'Interface responsiva com React',
          'Integração frontend/backend',
          'Arquitetura escalável',
        ],
        github: 'https://github.com/pedrolucas167/sistema-estoque',
        category: 'fullstack',
      },
    ];

    return projects.find((p) => p.id === id);
  }

  private populateModal(project: Project): void {
    const title = $('#modal-title');
    const category = $('#modal-category');
    const icon = $('#modal-icon');
    const description = $('#modal-description');
    const features = $('#modal-features');
    const technologies = $('#modal-technologies');
    const githubLink = $('#modal-github') as HTMLAnchorElement;
    const demoLink = $('#modal-demo') as HTMLAnchorElement;

    if (title) title.textContent = project.title;
    if (category) category.textContent = this.getCategoryLabel(project.category);
    if (icon) icon.className = this.getCategoryIcon(project.category) + ' text-6xl text-white/80';
    if (description) description.textContent = project.longDescription;

    // Features
    if (features) {
      features.innerHTML = project.features
        .map(
          (feature) => `
          <li class="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <i class="fas fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
            <span>${feature}</span>
          </li>
        `
        )
        .join('');
    }

    // Technologies
    if (technologies) {
      technologies.innerHTML = project.technologies
        .map(
          (tech) => `
          <span class="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg">
            ${tech}
          </span>
        `
        )
        .join('');
    }

    // Links
    if (githubLink) {
      githubLink.href = project.github;
    }

    if (demoLink) {
      if (project.demo) {
        demoLink.href = project.demo;
        demoLink.classList.remove('hidden');
      } else {
        demoLink.classList.add('hidden');
      }
    }
  }

  public open(): void {
    if (!this.modal || !this.overlay) return;

    this.isOpen = true;
    document.body.style.overflow = 'hidden';

    // Animate in
    this.overlay.classList.remove('invisible', 'opacity-0');
    this.overlay.classList.add('opacity-100');

    this.modal.classList.remove('invisible', 'opacity-0', 'scale-95');
    this.modal.classList.add('opacity-100', 'scale-100');

    // Focus trap
    const firstFocusable = this.modal.querySelector('button, a') as HTMLElement;
    firstFocusable?.focus();
  }

  public close(): void {
    if (!this.modal || !this.overlay) return;

    this.isOpen = false;
    document.body.style.overflow = '';

    // Animate out
    this.overlay.classList.add('opacity-0');
    this.modal.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      this.overlay?.classList.add('invisible');
      this.modal?.classList.add('invisible');
      this.modal?.classList.remove('scale-100');
    }, 300);
  }
}
