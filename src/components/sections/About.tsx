import { FaCode, FaServer, FaCloud, FaLightbulb, FaRocket, FaUsers, FaBrain, FaGraduationCap } from 'react-icons/fa';
import { GlassCard, SectionWrapper } from '../ui';
import { useReveal } from '../../hooks/useReveal';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function About() {
  const { t } = useTranslation(); // Initialize useTranslation
  const { ref, isRevealed } = useReveal({ threshold: 0.1 });

  const skills = [
    { 
      icon: FaCode, 
      title: t('about_skill_frontend_title'), 
      desc: t('about_skill_frontend_desc'),
      color: 'from-cyan-500 to-blue-500',
    },
    { 
      icon: FaServer, 
      title: t('about_skill_backend_title'), 
      desc: t('about_skill_backend_desc'),
      color: 'from-green-500 to-emerald-500',
      details: t('about_skill_backend_details')
    },
    { 
      icon: FaCloud, 
      title: t('about_skill_devops_title'),
      desc: t('about_skill_devops_desc'),
      color: 'from-purple-500 to-pink-500',
      details: t('about_skill_devops_details')
    },
    {
      icon: FaBrain,
      title: t('about_skill_ia_llms_title'),
      desc: t('about_skill_ia_llms_desc'),
      color: 'from-amber-500 to-orange-500',
      details: t('about_skill_ia_llms_details')
    },
  ];

  const highlights = [
    { icon: FaLightbulb, label: t('about_highlight_creative_thinking_label'), value: t('about_highlight_creative_thinking_value') },
    { icon: FaRocket, label: t('about_highlight_high_performance_label'), value: t('about_highlight_high_performance_value') },
    { icon: FaUsers, label: t('about_highlight_collaboration_label'), value: t('about_highlight_collaboration_value') },
    { 
      icon: FaGraduationCap, 
      label: 'Brainly', 
      value: t('about_highlight_brainly_value', 'Contribuidor Expert'), 
      href: 'https://brainly.com.br/app/profile/3845094/answers' 
    },
  ];

  return (
    <SectionWrapper id="sobre" className="bg-[var(--color-dark-bg)]">
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium accent mb-3 sm:mb-4 inline-block">{t('about_badge')}</span>
          <h2 className="section-title mb-3 sm:mb-4">
            {t('about_title_part1')}{' '}
            <span className="text-gradient-animated">{t('about_title_part2')}</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            {t('about_subtitle_p1')}
          </p>
          <p className="mt-4 mx-auto max-w-3xl px-2 sm:px-0 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            {t('about_subtitle_p2')}
          </p>
          <p className="mt-6 mx-auto max-w-3xl px-2 sm:px-0 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            <span className="text-[var(--color-accent)] font-semibold">{t('about_subtitle_ia_specialty_label')}</span> {t('about_subtitle_ia_specialty_text')}
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {skills.map((skill, i) => (
            <GlassCard 
              key={skill.title}
              tilt
              className={`p-5 sm:p-8 transition-all duration-700 ${
                isRevealed 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 150}ms` } as React.CSSProperties}
            >
              
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                <skill.icon className="text-xl sm:text-2xl text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                {skill.title}
              </h3>
              
              <p className="text-[var(--color-accent)] font-medium text-xs sm:text-sm mb-2 sm:mb-3">
                {skill.desc}
              </p>
              
              <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed">
                {skill.details}
              </p>
            </GlassCard>
          ))}
        </div>

        
        <div className="glass-card-subtle p-5 sm:p-8 rounded-xl sm:rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {highlights.map((item, i) => {
              const content = (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-lg sm:text-xl text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-[#64748b]">{item.label}</p>
                    <p className="text-white font-semibold text-sm sm:text-base">{item.value}</p>
                  </div>
                </>
              );

              const commonProps = {
                key: item.label,
                className: `flex items-center gap-3 sm:gap-4 transition-all duration-700 ${
                  isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                } ${'href' in item ? 'hover:opacity-70 transition-opacity cursor-pointer' : ''}`,
                style: { transitionDelay: `${600 + i * 150}ms` }
              };

              return 'href' in item ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" {...commonProps}>{content}</a>
              ) : (
                <div {...commonProps}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
