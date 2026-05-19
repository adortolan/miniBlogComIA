import { describe, it, expect } from 'vitest';
import { generateSlug } from './generateSlug';

describe('generateSlug', () => {
  it('deve converter título para lowercase', () => {
    const slug = generateSlug('Meu Primeiro Post');
    expect(slug).toBe('meu-primeiro-post');
  });

  it('deve remover acentos e caracteres especiais', () => {
    const slug = generateSlug('Título com Ãçêntos');
    expect(slug).toBe('titulo-com-acentos');
  });

  it('deve substituir espaços por hífens', () => {
    const slug = generateSlug('Post com muitos espaços');
    expect(slug).toBe('post-com-muitos-espacos');
  });

  it('deve remover múltiplos hífens consecutivos', () => {
    const slug = generateSlug('Post   com    espaços   extras');
    expect(slug).toBe('post-com-espacos-extras');
  });

  it('deve remover hífens do início e fim', () => {
    const slug = generateSlug('  Post com espaços nas bordas  ');
    expect(slug).toBe('post-com-espacos-nas-bordas');
  });

  it('deve lidar com caracteres especiais', () => {
    const slug = generateSlug('React.js & Node.js: O Guia Completo!');
    expect(slug).toBe('reactjs-nodejs-o-guia-completo');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    const slug = generateSlug('');
    expect(slug).toBe('');
  });

  it('deve lidar com strings apenas com caracteres especiais', () => {
    const slug = generateSlug('!@#$%^&*()');
    expect(slug).toBe('');
  });
});
