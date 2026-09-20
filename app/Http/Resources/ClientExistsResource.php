<?php

namespace App\Http\Resources;

use App\Exceptions\ClientExistsException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientExistsResource extends JsonResource
{
    /**
     * @return array<string, string>
     */
    public function toArray(Request $request): array
    {
        return [
            'message' => $this->resource instanceof ClientExistsException
                ? $this->resource->getMessage()
                : ClientExistsException::DEFAULT_MESSAGE,
        ];
    }
}
