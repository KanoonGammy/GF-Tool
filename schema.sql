-- =========================================================================
-- D1 SQL Schema for Fashion Dresses AI Studio
-- Includes Garment DNA, Video Runs, Definition of Done, and AI Memory Store
-- =========================================================================

-- 1. Users / Authorized Friends
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'creator', -- 'admin', 'creator', 'reviewer'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dress Ad Projects
CREATE TABLE IF NOT EXISTS dress_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'cocktail_dress', 'summer_maxi', 'silk_evening', 'linen_casual'
    target_audience TEXT,   -- e.g. 'Working women 25-35', 'Wedding guests'
    key_selling_points TEXT, -- JSON array of USPs
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'dna_extracted', 'generating', 'ready_for_review', 'revision_requested', 'approved'
    created_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Garment DNA (Persistent Spec created by Gemini Multimodal)
CREATE TABLE IF NOT EXISTS garment_dna (
    id TEXT PRIMARY KEY,
    project_id TEXT UNIQUE REFERENCES dress_projects(id) ON DELETE CASCADE,
    fabric_type TEXT NOT NULL,           -- e.g. 'Chiffon Silk with satin lining'
    fabric_physics TEXT NOT NULL,        -- e.g. 'High drape fluidity, soft matte luster, flutter movement'
    color_palette_json TEXT NOT NULL,    -- JSON: [{name: 'Dusty Rose', hex: '#DCAE96'}]
    cut_and_silhouette TEXT NOT NULL,   -- Neckline, sleeves, waistline, hemline
    unique_details TEXT NOT NULL,        -- Embroidery, pleats, pearl buttons
    default_negative_prompts TEXT NOT NULL, -- Compiled hard negative tokens
    raw_gemini_analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Video Generation Runs (Google Flow / Veo / Omni-Flash Iterations)
CREATE TABLE IF NOT EXISTS video_generations (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES dress_projects(id) ON DELETE CASCADE,
    iteration_number INTEGER NOT NULL DEFAULT 1,
    video_url TEXT,                      -- Link to R2 storage or generated preview
    cover_image_url TEXT,
    engine TEXT NOT NULL DEFAULT 'google_flow_omni', -- 'google_flow_omni', 'google_veo_3', 'ai_studio_native'
    positive_prompt TEXT NOT NULL,
    negative_prompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- 'rendering', 'completed', 'failed'
    duration_seconds INTEGER DEFAULT 10,
    aspect_ratio TEXT DEFAULT '9:16',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Definition of Done (DoD) Evaluations
CREATE TABLE IF NOT EXISTS dod_evaluations (
    id TEXT PRIMARY KEY,
    generation_id TEXT UNIQUE REFERENCES video_generations(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES dress_projects(id) ON DELETE CASCADE,
    
    -- 4 Core DoD Checkpoints:
    fabric_fidelity_passed BOOLEAN DEFAULT 0,    -- ลวดลายและสีผ้าตรงต้นฉบับ 100%
    cut_integrity_passed BOOLEAN DEFAULT 0,      -- คัตติ้ง (คอ/แขน/ชายกระโปรง) ไม่ morphing
    model_presentation_passed BOOLEAN DEFAULT 0, -- ท่าโพสและการเดินไม่บดบังชุด
    audio_visual_sync_passed BOOLEAN DEFAULT 0,  -- เสียงพากย์และดนตรีชัดเจน

    decision TEXT NOT NULL,                      -- 'ACCEPTED', 'REVISION_REQUESTED'
    reviewer_notes TEXT,
    reviewed_by TEXT,
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Cumulative AI Memory Store (ประวัติการแก้ไขและสิ่งที่ AI ต้องจำ)
CREATE TABLE IF NOT EXISTS revision_memories (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES dress_projects(id) ON DELETE CASCADE,
    generation_id TEXT REFERENCES video_generations(id),
    feedback_category TEXT NOT NULL, -- 'fabric_texture', 'pattern_drift', 'cut_morphing', 'lighting_color', 'model_motion'
    user_feedback_text TEXT NOT NULL,
    added_negative_tokens TEXT,      -- ข้อห้ามใหม่ที่ผู้ใช้สั่งเพิ่ม
    ai_learned_rule TEXT,            -- สิ่งที่ Gemini กลั่นออกมาเป็น Rule ใหม่
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
