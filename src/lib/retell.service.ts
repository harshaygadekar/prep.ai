import Retell from "retell-sdk";
import { RETELL_AGENT_GENERAL_PROMPT } from "./constants";

// Initialize Retell client
const retellClient = process.env.RETELL_API_KEY
  ? new Retell({
      apiKey: process.env.RETELL_API_KEY,
    })
  : null;

export interface CreateAgentParams {
  name: string;
  description?: string;
  personality?: string;
  expertise?: string[];
  voice?: string;
  rapport?: number;
  exploration?: number;
  empathy?: number;
  speed?: number;
}

export class RetellService {
  /**
   * Check if Retell is configured
   */
  static isConfigured(): boolean {
    return !!process.env.RETELL_API_KEY && !!retellClient;
  }

  /**
   * Create a Retell agent for an interviewer
   */
  static async createAgent(params: CreateAgentParams): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn("Retell API key not configured. Returning mock agent ID.");
      return `agent_mock_${Date.now()}`;
    }

    try {
      const {
        name,
        description = "",
        personality = "Professional and friendly",
        expertise = [],
        voice = "11labs-Adrian",
        rapport = 7,
        exploration = 7,
        empathy = 7,
        speed = 1.0,
      } = params;

      // Build the agent prompt
      const agentPrompt = `You are ${name}, an AI interviewer.

Description: ${description}

Personality: ${personality}

Expertise: ${expertise.join(", ")}

${RETELL_AGENT_GENERAL_PROMPT}`;

      // Create agent using Retell SDK
      const agent = await retellClient!.agent.create({
        agent_name: name,
        voice_id: voice,
        language: "en-US",
        // Agent configuration
        general_prompt: agentPrompt,
        general_tools: [],
        // Voice settings
        responsiveness: rapport / 10, // Convert 0-10 to 0-1
        enable_backchannel: empathy > 7,
        ambient_sound: "off",
        // Speed configuration
        voice_speed: speed,
        voice_temperature: exploration / 10, // Use exploration for creativity
        // Response settings
        opt_out_sensitive_data_storage: false,
        pronunciation_dictionary: [],
      });

      console.log(`Created Retell agent: ${agent.agent_id} for ${name}`);
      return agent.agent_id;
    } catch (error) {
      console.error("Error creating Retell agent:", error);
      // Return mock agent ID on error
      return `agent_error_${Date.now()}`;
    }
  }

  /**
   * Update an existing Retell agent
   */
  static async updateAgent(
    agentId: string,
    params: Partial<CreateAgentParams>
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn("Retell API key not configured. Cannot update agent.");
      return false;
    }

    try {
      const updateData: any = {};

      if (params.name) {
        updateData.agent_name = params.name;
      }

      if (params.voice) {
        updateData.voice_id = params.voice;
      }

      if (params.rapport !== undefined) {
        updateData.responsiveness = params.rapport / 10;
      }

      if (params.empathy !== undefined) {
        updateData.enable_backchannel = params.empathy > 7;
      }

      if (params.speed !== undefined) {
        updateData.voice_speed = params.speed;
      }

      if (params.exploration !== undefined) {
        updateData.voice_temperature = params.exploration / 10;
      }

      // Build updated prompt if relevant params changed
      if (
        params.name ||
        params.description ||
        params.personality ||
        params.expertise
      ) {
        const agentPrompt = `You are ${params.name || "an AI interviewer"}.

${params.description ? `Description: ${params.description}` : ""}

${params.personality ? `Personality: ${params.personality}` : ""}

${params.expertise ? `Expertise: ${params.expertise.join(", ")}` : ""}

${RETELL_AGENT_GENERAL_PROMPT}`;

        updateData.general_prompt = agentPrompt;
      }

      await retellClient!.agent.update(agentId, updateData);

      console.log(`Updated Retell agent: ${agentId}`);
      return true;
    } catch (error) {
      console.error("Error updating Retell agent:", error);
      return false;
    }
  }

  /**
   * Delete a Retell agent
   */
  static async deleteAgent(agentId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn("Retell API key not configured. Cannot delete agent.");
      return false;
    }

    try {
      await retellClient!.agent.delete(agentId);
      console.log(`Deleted Retell agent: ${agentId}`);
      return true;
    } catch (error) {
      console.error("Error deleting Retell agent:", error);
      return false;
    }
  }

  /**
   * Get agent details
   */
  static async getAgent(agentId: string) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const agent = await retellClient!.agent.retrieve(agentId);
      return agent;
    } catch (error) {
      console.error("Error retrieving Retell agent:", error);
      return null;
    }
  }

  /**
   * Register a call with Retell
   */
  static async registerCall(params: {
    agentId: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.isConfigured()) {
      throw new Error("Retell API key not configured");
    }

    try {
      const response = await retellClient!.call.register({
        agent_id: params.agentId,
        audio_websocket_protocol: "web",
        audio_encoding: "s16le",
        sample_rate: 24000,
        metadata: params.metadata,
      });

      return response;
    } catch (error) {
      console.error("Error registering call:", error);
      throw error;
    }
  }

  /**
   * Get call details
   */
  static async getCall(callId: string) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const call = await retellClient!.call.retrieve(callId);
      return call;
    } catch (error) {
      console.error("Error retrieving call:", error);
      return null;
    }
  }

  /**
   * List all calls with optional filtering
   */
  static async listCalls(params?: {
    limit?: number;
    agent_id?: string;
  }) {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const calls = await retellClient!.call.list(params);
      return calls;
    } catch (error) {
      console.error("Error listing calls:", error);
      return [];
    }
  }
}

export default RetellService;
