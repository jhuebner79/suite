<?php

/**
 * This file is part of the Spryker Suite.
 * For full license information, please view the LICENSE file that was distributed with this source code.
 */

namespace Pyz\Zed\CategoryPageSearch;

use Pyz\Zed\Synchronization\SynchronizationConfig;
use Spryker\Shared\Publisher\PublisherConfig;
use Spryker\Zed\CategoryPageSearch\CategoryPageSearchConfig as SprykerCategoryPageSearchConfig;

class CategoryPageSearchConfig extends SprykerCategoryPageSearchConfig
{
    /**
     * @return string
     */
    public function getCategoryPageSynchronizationPoolName(): string
    {
        return SynchronizationConfig::DEFAULT_SYNCHRONIZATION_POOL_NAME;
    }

    /**
     * @return string|null
     */
    public function getCategoryPageEventQueueName(): ?string
    {
        return PublisherConfig::PUBLISH_QUEUE;
    }
}
