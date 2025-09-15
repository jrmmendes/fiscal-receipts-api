type FiscalReceiptProps = {
  id: string;
  source: string;
  timestamp: string;
  format: string;
  payload: unknown;
};

class FiscalReceipt {
  private props: FiscalReceiptProps;

  constructor(props: FiscalReceiptProps) {
    this.props = props;
  }

  serialize() {
    return {
      ...this.props,
      payload: Buffer.from(JSON.stringify(this.props.payload)).toString(
        'base64',
      ),
    };
  }
}
