<?php

namespace Pyz\Yves\Checkout\Controller;

use Codeception\Step;
use Generated\Shared\Transfer\QuoteTransfer;
use Pyz\Yves\Checkout\Process\StepProcess;
use Spryker\Client\Cart\CartClientInterface;
use Spryker\Yves\Application\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Pyz\Yves\Checkout\CheckoutFactory;

/**
 * @method CheckoutFactory getFactory()
 */
class CheckoutController extends AbstractController
{

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function customerAction(Request $request)
    {
        return $this->createStepProcess()->process($request);
    }
    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function addressAction(Request $request)
    {
        return $this->createStepProcess()->process($request, $this->getFactory()->createAddressCollectionForm());
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function shipmentAction(Request $request)
    {
        return $this->createStepProcess()->process($request, $this->getFactory()->createShipmentForm());
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function paymentAction(Request $request)
    {
        $quoteTransfer = $this->getQuoteTransfer();

        return $this->createStepProcess()->process($request, $this->getFactory()->createPaymentForm($quoteTransfer));
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function summaryAction(Request $request)
    {
        return $this->createStepProcess()->process($request, $this->getFactory()->createSummaryForm());
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function placeOrderAction(Request $request)
    {
        return $this->createStepProcess()->process($request);
    }

    /**
     * @param Request $request
     *
     * @return array|RedirectResponse
     */
    public function successAction(Request $request)
    {
        return $this->createStepProcess()->process($request);
    }

    /**
     * @param Request $request
     */
    public function errorAction(Request $request)
    {
    }

    /**
     * @return StepProcess
     */
    protected function createStepProcess()
    {
        return $this->getFactory()->createCheckoutProcess($this->getApplication());
    }

    /**
     * @return QuoteTransfer
     */
    protected function getQuoteTransfer()
    {
        $cartClient = $this->getCartClient();

        return $cartClient->getQuote();
    }

    /**
     * @return CartClientInterface
     */
    protected function getCartClient()
    {
        return $this->getFactory()->getCartClient();
    }

}
