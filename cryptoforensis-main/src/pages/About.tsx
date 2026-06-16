import { Layout } from '@/components/layout/Layout';
import {
  Shield,
  BookOpen,
  Scale,
  Github,
  Mail,
  ExternalLink,
} from 'lucide-react';

const About = () => {

  const features = [
    {
      icon: Shield,
      title: 'Wallet Risk Analysis',
      description:
        'Advanced scoring algorithms to assess wallet risk based on transaction patterns, connections, and behavioral analysis.',
    },
    {
      icon: BookOpen,
      title: 'Graph Visualization',
      description:
        'Neo4j-style interactive graphs for exploring wallet connections and identifying suspicious clusters.',
    },
    {
      icon: Scale,
      title: 'ML-Powered Detection',
      description:
        'Machine learning models trained to detect money laundering patterns, mixer usage, and anomalous transactions.',
    },
  ];

  return (
    <Layout
      title="About"
      subtitle="Project information and academic context"
    >
      {/* Hero Section */}
      <div className="glass-card p-8 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/10" />
        <div className="relative">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/20 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">CryptoTransactionForensics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A blockchain forensics platform for detecting illicit activities and
            analyzing cryptocurrency transaction patterns through advanced
            visualization and machine learning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Project Summary */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Project Overview
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              CryptoTransactionForensics is an academic research project developed to aid forensic
              investigators in tracking and analyzing potentially illicit
              cryptocurrency activities. The platform combines graph database
              technology, machine learning algorithms, and interactive
              visualizations to provide comprehensive blockchain analysis
              capabilities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The system analyzes wallet connections, transaction patterns, and
              behavioral indicators to identify potential money laundering,
              ransomware payments, and dark web-associated transactions. All
              analysis is performed on simulated or public blockchain data for
              research purposes.
            </p>
            <h4 className="text-foreground font-semibold mt-6 mb-3">
              Key Research Objectives
            </h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Develop effective visualization techniques for blockchain
                transaction networks
              </li>
              <li>
                Implement machine learning models for anomaly detection in
                cryptocurrency transactions
              </li>
              <li>
                Create risk scoring methodologies based on wallet behavior and
                connections
              </li>
              <li>
                Build a user-friendly interface for forensic investigators
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          System Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h4 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Notice */}
      <div className="glass-card p-6 mb-6 border border-info/30 bg-info/5">
        <div className="flex items-start gap-4">
          <Scale className="h-6 w-6 text-info mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ethical Notice & Data Disclaimer
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                This platform is developed strictly for academic research and
                educational purposes. It does not perform real-time dark web
                monitoring or access illegal content.
              </p>
              <p>
                All dark web association data displayed is simulated or derived
                from publicly available, anonymized research datasets. No
                personally identifiable information is collected or processed.
              </p>
              <p>
                The system is designed to demonstrate forensic analysis
                techniques and should not be used for actual law enforcement
                without proper authorization and legal frameworks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Contact & Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium text-foreground">GitHub Repository</p>
              <p className="text-xs text-muted-foreground">View source code</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium text-foreground">Documentation</p>
              <p className="text-xs text-muted-foreground">Read the docs</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium text-foreground">Contact Team</p>
              <p className="text-xs text-muted-foreground">Get in touch</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default About;
