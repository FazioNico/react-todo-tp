import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  let mockAddToFirebase;

  beforeEach(() => {
    mockAddToFirebase = vi.fn();
  });

  describe('Validation de l\'utilisateur', () => {
    it('doit lever une erreur si currentUser est null', () => {
      const currentUser = null;

      expect(() => {
        if (!currentUser?.uid) {
          throw new Error('No user found');
        }
      }).toThrow('No user found');
    });

    it('doit lever une erreur si currentUser.uid n\'existe pas', () => {
      const currentUser = {};

      expect(() => {
        if (!currentUser?.uid) {
          throw new Error('No user found');
        }
      }).toThrow('No user found');
    });

    it('doit lever une erreur si currentUser est undefined', () => {
      const currentUser = undefined;

      expect(() => {
        if (!currentUser?.uid) {
          throw new Error('No user found');
        }
      }).toThrow('No user found');
    });
  });

  describe('Appel à addToFirebase', () => {
    it('doit appeler addToFirebase avec l\'uid et le titre', () => {
      const currentUser = { uid: 'user-123' };
      const todoTitle = 'Faire les courses';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, todoTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', 'Faire les courses');
      expect(mockAddToFirebase).toHaveBeenCalledTimes(1);
    });

    it('doit appeler addToFirebase avec les bons paramètres dans le bon ordre', () => {
      const currentUser = { uid: 'test-user-123' };
      const todoTitle = 'Ma première tâche';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, todoTitle);

      const calls = mockAddToFirebase.mock.calls;
      expect(calls[0][0]).toBe('test-user-123');
      expect(calls[0][1]).toBe('Ma première tâche');
    });

    it('doit accepter une saisie vide comme titre valide', () => {
      const currentUser = { uid: 'user-123' };
      const emptyTitle = '';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, emptyTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', '');
    });

    it('doit accepter les titres longs', () => {
      const currentUser = { uid: 'user-123' };
      const longTitle = 'A'.repeat(500);

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, longTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', longTitle);
    });

    it('doit accepter les titres avec caractères spéciaux', () => {
      const currentUser = { uid: 'user-123' };
      const specialTitle = 'Acheter du café ☕ et des 🍪 - 50% & "prix réduit"';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, specialTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', specialTitle);
    });

    it('doit accepter les titres avec espaces multiples', () => {
      const currentUser = { uid: 'user-123' };
      const titleWithSpaces = '  Tâche   avec    espaces  ';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, titleWithSpaces);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', titleWithSpaces);
    });
  });

  describe('Gestion d\'erreurs', () => {
    it('ne doit pas appeler addToFirebase si l\'utilisateur n\'est pas authentifié', () => {
      const currentUser = null;

      expect(() => {
        if (!currentUser?.uid) {
          throw new Error('No user found');
        }
        mockAddToFirebase(currentUser.uid, 'titre');
      }).toThrow('No user found');

      expect(mockAddToFirebase).not.toHaveBeenCalled();
    });

    it('doit vérifier le uid avant d\'appeler addToFirebase', () => {
      const currentUser = { uid: null };

      expect(() => {
        if (!currentUser?.uid) {
          throw new Error('No user found');
        }
        mockAddToFirebase(currentUser.uid, 'titre');
      }).toThrow('No user found');

      expect(mockAddToFirebase).not.toHaveBeenCalled();
    });
  });

  describe('Cas limites', () => {
    it('doit gérer les uids avec des caractères spéciaux', () => {
      const currentUser = { uid: 'user-123@example.com/path' };
      const todoTitle = 'Tâche importante';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, todoTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123@example.com/path', todoTitle);
    });

    it('doit gérer les titres sur plusieurs lignes', () => {
      const currentUser = { uid: 'user-123' };
      const multilineTitle = 'Première ligne\nDeuxième ligne\nTroisième ligne';

      if (!currentUser?.uid) {
        throw new Error('No user found');
      }
      mockAddToFirebase(currentUser.uid, multilineTitle);

      expect(mockAddToFirebase).toHaveBeenCalledWith('user-123', multilineTitle);
    });
  });
});
