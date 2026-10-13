/**
 * Flow Service — Communicates with local FlowKit Agent (:8100)
 * which controls Google Flow via the Chrome Extension bridge.
 */

export interface FlowStatus {
  connected: boolean;
  transport: string;
  flow_project_id?: string;
  flow_key_present?: boolean;
}

export interface VideoGenerationJob {
  media_id?: string;
  workflow_id?: string;
  operation_id?: string;
  status?: string;
  url?: string;
  error?: string;
}

export class FlowService {
  /**
   * Check connection to FlowKit and Chrome extension
   */
  static async getStatus(): Promise<FlowStatus> {
    try {
      const res = await fetch('/api/flow/status');
      if (!res.ok) {
        return { connected: false, transport: 'none' };
      }
      return await res.json();
    } catch {
      return { connected: false, transport: 'none' };
    }
  }

  /**
   * Set active Google Flow Project UUID
   */
  static async setProject(projectId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/flow/set-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId.trim() })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate an image via Nano Banana Pro (GEM_PIX_2)
   */
  static async generateImage(
    prompt: string,
    projectId: string = '',
    aspectRatio: string = 'IMAGE_ASPECT_RATIO_PORTRAIT'
  ): Promise<{ media_id: string; url: string }> {
    const res = await fetch('/api/flow/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        project_id: projectId,
        aspect_ratio: aspectRatio,
        user_paygate_tier: 'PAYGATE_TIER_TWO'
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate image' }));
      throw new Error(err.detail || err.error || 'Image generation failed');
    }

    const data = await res.json();
    const mediaList = data.media || data.data?.media || [];
    const media = mediaList[0];
    if (!media || !media.url) {
      throw new Error('Flow returned no image URL');
    }
    return {
      media_id: media.media_id || '',
      url: media.url
    };
  }

  /**
   * Submit Text-to-Video via Gemini Omni Flash 1.1 (10s Vertical)
   */
  static async generateOmniVideo(
    prompt: string,
    projectId: string = '',
    durationSeconds: number = 10
  ): Promise<VideoGenerationJob> {
    const res = await fetch('/api/flow/generate-video-omni-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        project_id: projectId,
        duration_s: durationSeconds,
        aspect_ratio: 'VIDEO_ASPECT_RATIO_PORTRAIT',
        user_paygate_tier: 'PAYGATE_TIER_TWO'
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit' }));
      throw new Error(err.detail || err.error || 'Video generation failed to submit');
    }

    const data = await res.json();
    return {
      media_id: data.media_id,
      workflow_id: data.workflow_id,
      status: data.status || 'PENDING'
    };
  }

  /**
   * Poll Omni Flash / Veo video generation progress
   */
  static async checkStatus(job: VideoGenerationJob, projectId: string = ''): Promise<{ done: boolean; url?: string; error?: string }> {
    const payload: Record<string, any> = { project_id: projectId };

    if (job.workflow_id || job.media_id) {
      payload.workflows = [{
        workflow_id: job.workflow_id || job.media_id,
        media_id: job.media_id
      }];
    } else if (job.operation_id) {
      payload.operations = [{ name: job.operation_id }];
    }

    const res = await fetch('/api/flow/check-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Polling failed' }));
      throw new Error(err.detail || 'Status check failed');
    }

    const data = await res.json();

    // Check workflows (Omni Flash)
    if (data.workflows && data.workflows.length > 0) {
      const wf = data.workflows[0];
      if (wf.status === 'FAILED' || (wf.error && String(wf.error).includes('FAIL'))) {
        return { done: true, error: String(wf.error || 'Generation failed') };
      }
      if (wf.done || wf.status === 'COMPLETED' || wf.status === 'MEDIA_GENERATION_STATUS_SUCCESSFUL') {
        const mediaObj = typeof wf.media === 'object' ? wf.media : {};
        const url = mediaObj?.url || wf.url;
        if (url) {
          return { done: true, url };
        }
      }
    }

    // Check operations (Veo)
    if (data.operations && data.operations.length > 0) {
      const op = data.operations[0];
      if (op.done && op.url) {
        return { done: true, url: op.url };
      }
      if (op.status === 'MEDIA_GENERATION_STATUS_FAILED') {
        return { done: true, error: op.error || 'Veo operation failed' };
      }
    }

    if (data.url) {
      return { done: true, url: data.url };
    }

    return { done: false };
  }
}
