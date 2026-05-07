export const BUILDER_API_URL = process.env.NEXT_PUBLIC_BUILDER_API_URL || 'http://localhost:4000/api/v1';

export async function startBuilderSession(userId: string, title?: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to start session');
  }

  return response.json();
}

export async function listSessions(userId: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/list`, {
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to list sessions');
  }

  return response.json();
}

export async function getSession(sessionId: string, userId: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/${sessionId}`, {
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load session');
  }

  return response.json();
}

export async function renameSession(sessionId: string, title: string, userId: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/${sessionId}/rename`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to rename session');
  }
  return response.json();
}

export async function deleteSession(sessionId: string, userId: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/${sessionId}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete session');
  }
  return response.json();
}

export async function sendBuilderMessage(sessionId: string, message: string, userId: string, model?: string) {
  const response = await fetch(`${BUILDER_API_URL}/builder/session/${sessionId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ message, model }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    let errMsg = err.message || 'Failed to send message';
    if (err.errors && Array.isArray(err.errors)) {
      errMsg += ': ' + err.errors.map((e: any) => `${e.field} - ${e.message}`).join(', ');
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export async function finalizeResume(draftId: string, userId: string, title: string = 'My Resume') {
  const response = await fetch(`${BUILDER_API_URL}/builder/drafts/${draftId}/finalize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ title, templateKey: 'modern-ats' }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to finalize resume');
  }

  return response.json();
}

/**
 * Export resume as PDF — downloads as a blob and triggers a
 * browser download to the user's system Downloads folder.
 */
export async function exportResumePdf(resumeId: string, userId: string, filename: string = 'resume.pdf') {
  const response = await fetch(`${BUILDER_API_URL}/resumes/${resumeId}/export-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to export PDF');
  }

  const result = await response.json();

  // The backend returns a pdfUrl path — fetch the actual file as blob
  if (result.data?.pdfUrl) {
    const pdfResponse = await fetch(`${BUILDER_API_URL.replace('/api/v1', '')}${result.data.pdfUrl}`);
    if (!pdfResponse.ok) throw new Error('Failed to download PDF file');

    const blob = await pdfResponse.blob();
    // Trigger a browser download to the user's system Downloads folder
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return result;
}

export async function listModels() {
  const response = await fetch(`${BUILDER_API_URL}/builder/models`);
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  return response.json();
}
